import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export async function DELETE(req) {
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }
    
    const userId = claim.id 
    
    const searchParams = req.nextUrl.searchParams
    const channel = searchParams.get('channel')
    const taskId = searchParams.get('id')

    // is this user a member of this channel?
    const checkMemberQuery = `
    SELECT Channels.* FROM Channels 
    INNER JOIN UsersChannels ON Channels.id = UsersChannels.channel_id 
    WHERE Channels.join_url = $1 AND UsersChannels.user_id = $2`

    // Delete a task from `tasks` table where the task.id is identified
    const deleteTaskQuery = `DELETE FROM tasks WHERE id = $1 RETURNING *;`
    
    try {
        const checkMember = await pool.query(checkMemberQuery, [channel, userId])
        if (checkMember.rowCount === 0) {
            return new Response(null, { status: 401, statusText: "You can't delete the task since you are not a member of the channel."})  
        }

        const deleteTask = await pool.query(deleteTaskQuery, [taskId])
        if (deleteTask.rowCount > 0) {
            return new Response(deleteTask.rows[0], { status: 200, statusText: "The task has been deleted."})  
        }
        await pool.query('COMMIT')
    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error)
    }

    return new Response(null, { status: 500, statusText: "The error has occurred while processing the task creation." })
}
