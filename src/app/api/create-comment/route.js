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
    const { code, text } = await req.json()
    
    // SQL query to check if the user is a member of the channel using the join URL and user id
    const checkMemberQuery = `
    SELECT Channels.* FROM Channels 
    INNER JOIN UsersChannels ON Channels.id = UsersChannels.channel_id 
    WHERE Channels.join_url = $1 AND UsersChannels.user_id = $2`

    // SQL query to insert a new comment into the Comments table
    const insertCommentQuery = `
    INSERT INTO Comments (text, user_id, channel_id)
    VALUES ($1, $2, $3)
    RETURNING *`

    try {
        const checkMember = await pool.query(checkMemberQuery, [code, userId])
        if (checkMember.rowCount > 0) {
            // If the user is a member of the channel
            const channelId = rows[0].id

            // Insert new comment
            const comment = await pool.query(insertCommentQuery, [text, userId, channelId])
            await pool.query('COMMIT')
            if (comment.rowCount > 0) {
                return new Response(JSON.stringify(comment.rows[0]), { status: 201, statusText: "The comment has been created."})  
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
    return new Response(null, { status: 500, statusText: "The error has occurred while processing the comment creation." })
}
