import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export async function GET(req) {
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }
    
    const searchParams = req.nextUrl.searchParams
    const code = searchParams.get('code')
    if (!code) {
        return new Response(null, { status: 400, statusText: "The channel code is required." });
    }
    
    const userId = claim.id 

    const selectChannelQuery = `
    SELECT join_url FROM Channels 
    WHERE code = $1 AND EXISTS (
        SELECT 1 FROM UsersChannels 
        WHERE Channels.id = UsersChannels.channel_id 
        AND UsersChannels.user_id = $2
    )`;

    try {
        const { rows } = await pool.query(selectChannelQuery, [code, userId])
        if (rows.length == 0) {
            return new Response(null, { status: 404, statusText: "The channel is not found or you are not a member of this channel." });
        }
        
        const joinUrl = rows[0].join_url;
        return new Response(JSON.stringify({ joinUrl: joinUrl }), {
            status: 200,
            statusText: "Join URL found.",
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.log("Error fetching join URL:", error);
        return new Response(null, { status: 500, statusText: "An error has occurred while pulling the join URL." });
    }
}
