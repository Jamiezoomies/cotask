import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export async function GET(req) {
    // JWT Authentication
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }

    const userId = claim.id
    const searchParams = req.nextUrl.searchParams
    const code = searchParams.get('code')
    
    // SQL query to check if the user is a member
    const checkUserIsInGroupQuery = `
    SELECT Channels.* FROM Channels 
    INNER JOIN UsersChannels ON Channels.id = UsersChannels.channel_id 
    WHERE UsersChannels.user_id = $1 AND Channels.join_url = $2`

    // SQL query to get the group so that the user can join.
    const getGroupQuery = `
    SELECT Channels.* FROM Channels 
    INNER JOIN UsersChannels ON Channels.id = UsersChannels.channel_id 
    WHERE Channels.join_url = $1`

    try{
        // check if a matched group can be found.
        const { rowCount, rows } = await pool.query(getGroupQuery, [code])
        if (rowCount > 0) {
            // if found, check if the user is in group
            const isUserInGroup = await pool.query(checkUserIsInGroupQuery, [userId, code])
            if (isUserInGroup.rowCount > 0) {
                // if the user is in group,
                return new Response(JSON.stringify(rows[0]), 
                { status: 409, statusText: `A group ${rows[0].id} has been found and the user is already in the group.`})
            } else {   
                return new Response(JSON.stringify(rows[0]), 
                { status: 200, statusText: `A group ${rows[0].id} has been found and the user is not in the group.`})
            }
        }
        
        // if no group found,
        return new Response(null, { status: 404, statusText: "No group has been found."})
        
    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error)
    }
    
    return new Response(null, { status: 500, statusText: "The internal error has occurred."})
}