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
    const { name, description } = await req.json()

    // SQL query to insert a new group
    const insertGroupQuery = `
    INSERT INTO Channels (name, description, join_url)
    VALUES ($1, $2, $3)
    RETURNING *`

    // SQL query to insert the user into the created group.
    const insertUserGroupQuery = `
    INSERT INTO UsersChannels (user_id, channel_id)
    VALUES ($1, $2)
    RETURNING *`

    try{
        const createdGroup = await pool.query(insertGroupQuery, [name, description, getRandomUrl()])
        // After creating the new group, insert the user into the group.
        if (createdGroup.rowCount > 0) {
            const channelId = rows[0].id
            
            await pool.query(insertUserGroupQuery, [userId, channelId])
            await pool.query('COMMIT')
            return new Response(JSON.stringify(rows[0]), { status: 201, statusText: "The group has been created."})   
        }   
    } catch (error) {
        // Rollback the transaction in case of any errors.
        await pool.query('ROLLBACK')
        console.log(error)
    }

    return new Response(null, { status: 500, statusText: "The error has occurred while processing the group creation." })
}

// generates a random string of 10 characters from a specified set for join url
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