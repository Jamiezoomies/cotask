import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export async function DELETE(req) {
    
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }
    
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code'); 
    const taskId = searchParams.get('id'); 
    const userId = claim.id; 

    if (!taskId || !code) {
        return new Response(null, { status: 400, statusText: "Required parameters are missing." });
    }
    
    const deleteTaskQuery = `
    DELETE FROM Tasks
    WHERE id = $1
    AND channel_id = (SELECT id FROM Channels WHERE join_url = $2)
    AND EXISTS (
        SELECT 1 FROM UsersChannels
        WHERE channel_id = (SELECT id FROM Channels WHERE join_url = $2)
        AND user_id = $3
    )
    RETURNING *;`;

try {
    const result = await pool.query(deleteTaskQuery, [taskId, code, userId]);
    if (result.rowCount > 0) {
        return new Response(JSON.stringify({ message: "Task successfully deleted." }), { status: 200 });
    } else {
        return new Response(null, { status: 404, statusText: "Task not found or not authorized to delete." });
    }
} catch (error) {
    console.error(error);
    return new Response(null, { status: 500, statusText: "An error occurred while deleting the task." });
}
}