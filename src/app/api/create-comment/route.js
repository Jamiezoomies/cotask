import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export async function POST(req) {
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }
    
    const userId = claim.id 
    const { code, text } = await req.json()
    
    // is this user a member of this channel?
    const selectChannel = `
    SELECT Channels.* FROM Channels 
    INNER JOIN UsersChannels ON Channels.id = UsersChannels.channel_id 
    WHERE Channels.join_url = $1 AND UsersChannels.user_id = $2`

    const insertCommentQuery = `
    INSERT INTO Comments (text, user_id, channel_id)
    VALUES ($1, $2, $3)
    RETURNING *`

    try {
        const { rowCount, rows } = await pool.query(selectChannel, [code, userId])
        if (rowCount > 0) {
            const channelId = rows[0].id

            const comment = await pool.query(insertCommentQuery, [text, userId, channelId])
            await pool.query('COMMIT')
            if (comment.rowCount > 0) {
                return new Response(JSON.stringify(comment.rows[0]), { status: 201, statusText: "The comment has been created."})  
            }
        }
        return new Response(null, { status: 401, statusText: "The user is not a member of the channel."})  
    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error)
    }

    return new Response(null, { status: 500, statusText: "The error has occurred while processing the comment creation." })
}
