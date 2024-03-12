import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export async function POST(req) {
    // Extract JWT token from request headers using 'Bearer' scheme
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    // Decode JWT token to retrieve claim information
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }
    
    const userId = claim.id 
    const { title, description, dueDate, code } = await req.json()

    // SQL query to check if the user is a member of the channel using the join URL and user id
    const checkMemberQuery = `
    SELECT Channels.* FROM Channels 
    INNER JOIN UsersChannels ON Channels.id = UsersChannels.channel_id 
    WHERE Channels.join_url = $1 AND UsersChannels.user_id = $2`

    // SQL query to insert a new task into the tasks table
    const insertTaskQuery = `
    INSERT INTO Tasks (channel_id, created_by, title, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *`
    
    try {
        const checkMember= await pool.query(checkMemberQuery, [code, userId])
        // if user is a member of the channel, allow to insert the task
        if (checkMember.rowCount > 0) {
            const channelId = rows[0].id

            const task = await pool.query(insertTaskQuery, [channelId, userId, title, description])
            await pool.query('COMMIT')
            if (task.rowCount > 0) {
                return new Response(JSON.stringify(task.rows[0]), { status: 201, statusText: "The task has been created."})  
            }
        }
        // If user is not a member of the channel, return a 401 Unauthorized response
        return new Response(null, { status: 401, statusText: "The user is not a member of the channel."})  
    } catch (error) {
        // Rollback the transaction in case of any errors.
        await pool.query('ROLLBACK')
        console.log(error)
    }

    // Return a 500 Internal Server Error response if the creation fails for any other reason. 
    return new Response(null, { status: 500, statusText: "The error has occurred while processing the task creation." })
}
