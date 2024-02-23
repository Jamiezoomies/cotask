import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export async function POST(req) {
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }
    
    const userId = claim.id 
    const { name, description } = await req.json()

    const insertGroupQuery = `
    INSERT INTO Channels (name, description, join_url)
    VALUES ($1, $2, $3)
    RETURNING *`

    try{
        const { rowCount, rows } = await pool.query(insertGroupQuery, [name, description, getRandomUrl()])
        if (rowCount > 0) {
            const channelId = rows[0].id
            const insertUserGroupQuery = `
            INSERT INTO UsersChannels (user_id, channel_id)
            VALUES ($1, $2)
            RETURNING *`
            await pool.query(insertUserGroupQuery, [userId, channelId])
            await pool.query('COMMIT')
            return new Response(JSON.stringify(rows[0]), { status: 201, statusText: "The group has been created."})   
        }
        
    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error)
    }

    return new Response(null, { status: 500, statusText: "The error has occurred while processing the group creation." })
}

function getRandomUrl() {
    let length = 10
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}