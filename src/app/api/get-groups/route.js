import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export async function GET(req) {
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }

    const userId = claim.id 
    
    const getGroupsQuery = `
    SELECT Channels.* FROM Channels 
    INNER JOIN UsersChannels ON Channels.id = UsersChannels.channel_id 
    WHERE UsersChannels.user_id = $1`

    try{
        const { rowCount, rows } = await pool.query(getGroupsQuery, [userId])
        if (rowCount > 0) {
            return new Response(JSON.stringify(rows), 
            { status: 200, statusText: `${rowCount} groups have been found.`})
        } 
        
        return new Response(null, { status: 404, statusText: "No group has been found."})
    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error)
    }
    
    return new Response(null, { status: 500, statusText: "The internal error has occurred."})
}