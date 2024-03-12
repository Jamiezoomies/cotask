import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export async function POST(req) {
    // JWT Authentication
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }
    
    // Require channel code to join the group
    const { code } = await req.json()
    if (!code) {
        return new Response(null, { status: 400, statusText: "The channel code is invalid." });
    }
    
    const userId = claim.id 
    
    // SQL query to find the channel
    const selectChannel = `
    SELECT id FROM Channels 
    WHERE join_url = $1`

    // SQL query to find the channel and member user
    const userFoundInChannelQuery = `
    SELECT * FROM UsersChannels 
    WHERE user_id=$1 and channel_id=$2`

    // SQL query to insert the user into the channel
    const insertUserChannel = `
    INSERT INTO UsersChannels (user_id, channel_id) 
    VALUES ($1, $2)
    RETURNING *`

    try {
        const channelFound = await pool.query(selectChannel, [code]);
        if (channelFound.rows.length === 0) {
            return new Response(null, {status: 404, statusText: "The channel is not found."})
        }
    
        const channelId = channelFound.rows[0].id;

        const userFoundInChannel = await pool.query(userFoundInChannelQuery, [userId, channelId])
        if (userFoundInChannel.rows.length !== 0) {
            return new Response(null, {status: 409, statusText: `The user ${userId} is already a member of the channel ${channelId}`})
        }

        const insertResult = await pool.query(insertUserChannel, [userId, channelId])
        
        if (insertResult.rows.length !== 0) {
            return new Response(JSON.stringify(insertResult.rows[0]), {status: 201, statusText: `The User ${userId} has joined the group using the url, ${code}`})
        }
        
    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error)
    }

    return new Response(null, {status: 500, statusText: "The error has occurred while user joining."})
}