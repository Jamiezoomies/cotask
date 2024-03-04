import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export async function POST(req) {
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }
    
    const { code } = await req.json()
    if (!code) {
        return new Response(null, { status: 400, statusText: "The channel code is invalid." });
    }
    
    const userId = claim.id 
    
    try {
        const selectChannel = `
        SELECT id FROM Channels 
        WHERE join_url = $1`

        const channelFound = await pool.query(selectChannel, [code]);
        if (channelFound.rows.length === 0) {
            return new Response(null, {status: 404, statusText: "The channel is not found."})
        }
    
        const channelId = channelFound.rows[0].id;

        const insertUserChannel = `
        INSERT INTO UsersChannels (user_id, channel_id) 
        VALUES ($1, $2)
        RETURNING *`;
        
        const insertResult = await pool.query(insertUserChannel, [userId, channelId])
        
        if (insertResult.rows.length !== 0) {
            return new Response(insertResult.rows[0], {status: 201, statusText: `The User ${userId} has joined the group using the url, ${code}`})
        }
        
    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error)
    }

    return new Response(null, {status: 500, statusText: "The error has occurred while user joining."})
}