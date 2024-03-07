import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export async function PUT(req) {
    
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }
    
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const taskId = searchParams.get('id');
    const { title, description, dueDate } = await req.json();
    const userId = claim.id;

    if (!taskId) {
        return new Response(null, { status: 400, statusText: "The channel code is invalid." });
    }
    
    const updateTaskQuery = `
    UPDATE Tasks
    SET title = $1, description = $2, due_date = $3
    WHERE id = $4 AND channel_id = (SELECT id FROM Channels WHERE join_url = $5)
    AND EXISTS (
        SELECT 1 FROM UsersChannels 
        WHERE channel_id = (SELECT id FROM Channels WHERE join_url = $5) 
        AND user_id = $6
    )
    RETURNING *`;

try {
    const result = await pool.query(updateTaskQuery, [title, description, dueDate, taskId, code, userId]);
    if (result.rowCount > 0) {
        return new Response(JSON.stringify(result.rows[0]), { status: 200, statusText: "Task successfully updated." });
    } else {
        return new Response(null, { status: 404, statusText: "Task not found or not authorized to update." });
    }
} catch (error) {
    console.error(error);
    return new Response(null, { status: 500, statusText: "An error occurred while updating the task." });
}
}