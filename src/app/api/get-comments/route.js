import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export async function GET(req) {
    // JWT Authentication
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }
    
    // Retrieve data from the claim and query
    const userId = claim.id 
    const searchParams = req.nextUrl.searchParams
    const code = searchParams.get('code')
    const query = searchParams.get('query') || null

    // SQL query to check if the user is a member of the channel using the join URL and user id
    const selectChannel = `
    SELECT Channels.* FROM Channels 
    INNER JOIN UsersChannels ON Channels.id = UsersChannels.channel_id 
    WHERE Channels.join_url = $1 AND UsersChannels.user_id = $2`

    // SQL query to get comments array
    var getCommentsQuery = `
    SELECT Comments.*, Users.username, Users.email, Users.first_name, Users.last_name FROM Comments
    INNER JOIN Channels On Comments.channel_id = Channels.id
    INNER JOIN Users On Comments.user_id = Users.id
    WHERE Channels.id = $1`

    try {
        const { rowCount, rows } = await pool.query(selectChannel, [code, userId])
        if (rowCount > 0) {
            const channelId = rows[0].id

            // Added channelId field and query if search query exists
            var fields = [channelId]
            if (query) {
                getCommentsQuery += " AND LOWER(Comments.text) LIKE LOWER('%' || $2 || '%')"
                fields.push(query)
            }
            // retrieve data ordered by creation time
            getCommentsQuery += ' ORDER BY Comments.created_at ASC'

            const comments = await pool.query(getCommentsQuery, fields)
            await pool.query('COMMIT')
            if (comments.rowCount > 0) {
                return new Response(JSON.stringify(comments.rows), { status: 200, statusText: "The comments has been found."})  
            }
        }
        return new Response(null, { status: 401, statusText: "The user is not a member of the channel."})  
    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error)
    }

    return new Response(null, { status: 500, statusText: "The error has occurred while getting comments." })
}
