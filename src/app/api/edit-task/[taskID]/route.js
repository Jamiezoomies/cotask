import pool from "../../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../../lib/actions"

export async function PUT(req) {
    
    const { taskID } = req.query;

    const token = getJwtTokenFromHeaders(req.headers, 'Bearer');
    const claim = await getClaimFromJwtToken(token);
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }
    
    const userId = claim.id;
    const { title, description, dueDate, code } = await req.json();

    // Verify the user is a member of the channel and that the task exists and belongs to the user's channel.
    const verifyTaskAndChannel = `
    SELECT Tasks.*, Channels.id as channel_id FROM Tasks
    JOIN Channels ON Tasks.channel_id = Channels.id
    JOIN UsersChannels ON Channels.id = UsersChannels.channel_id
    WHERE Tasks.id = $1 AND Channels.join_url = $2 AND UsersChannels.user_id = $3`;

    try {
        const verificationResult = await pool.query(verifyTaskAndChannel, [taskID, code, userId]);
        if (verificationResult.rowCount > 0) {
            // Task and channel verified, proceed to update
            const updateTaskQuery = `
            UPDATE Tasks
            SET title = $2, description = $3, due_date = $4, updated_at = NOW()
            WHERE id = $1 AND channel_id = $5
            RETURNING *`;
            const taskUpdateResult = await pool.query(updateTaskQuery, [taskID, title, description, dueDate, verificationResult.rows[0].channel_id]);

            if (taskUpdateResult.rowCount > 0) {
                await pool.query('COMMIT');
                return new Response(JSON.stringify(taskUpdateResult.rows[0]), { status: 200, statusText: "The task has been updated."});
            } else {
                // Task not found or not authorized to update
                return new Response(null, { status: 404, statusText: "Task not found or not authorized to update." });
            }
        } else {
            // Channel verification failed
            return new Response(null, { status: 404, statusText: "Channel not found or task does not belong to this channel." });
        }
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error(error);
        return new Response(null, { status: 500, statusText: "An error occurred while processing the task update." });
    }
}