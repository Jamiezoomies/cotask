import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export async function GET(req) {
    // JWT authentication
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }

    const userId = claim.id
    const searchParams = req.nextUrl.searchParams
    const code = searchParams.get('code')
    
    // SQL query to get a group. Requesting user should be a member of the group channel.
    const getGroupQuery = `
    SELECT Channels.* FROM Channels 
    INNER JOIN UsersChannels ON Channels.id = UsersChannels.channel_id 
    WHERE UsersChannels.user_id = $1 AND Channels.join_url = $2`

    try{
        const { rowCount, rows } = await pool.query(getGroupQuery, [userId, code])
        if (rowCount > 0) {
            return new Response(JSON.stringify(rows[0]), 
            { status: 200, statusText: `A group ${rows[0].id} has been found.`})
        } 
        
        return new Response(null, { status: 404, statusText: "No group has been found."})
    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error)
    }
    
    return new Response(null, { status: 500, statusText: "The internal error has occurred."})
}