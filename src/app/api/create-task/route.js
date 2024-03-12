import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export async function POST(req) {
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }
    
    const userId = claim.id 
    const { title, description, dueDate, code } = await req.json()

    // is this user a member of this channel?
    const selectChannel = `
    SELECT Channels.* FROM Channels 
    INNER JOIN UsersChannels ON Channels.id = UsersChannels.channel_id 
    WHERE Channels.join_url = $1 AND UsersChannels.user_id = $2`

    try {
        const { rowCount, rows } = await pool.query(selectChannel, [code, userId])
        if (rowCount > 0) {
            const channelId = rows[0].id

            const insertTaskQuery = `
            INSERT INTO Tasks (channel_id, created_by, title, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *`
            const task = await pool.query(insertTaskQuery, [channelId, userId, title, description])
            await pool.query('COMMIT')
            if (task.rowCount > 0) {
                return new Response(JSON.stringify(task.rows[0]), { status: 201, statusText: "The task has been created."})  
            }
        }
        return new Response(null, { status: 401, statusText: "The user is not a member of the channel."})  
    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error)
    }

    return new Response(null, { status: 500, statusText: "The error has occurred while processing the task creation." })
}
