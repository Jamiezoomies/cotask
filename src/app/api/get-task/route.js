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
    const taskId = searchParams.get('id')

    if (!taskId) {
        return new Response(null, { status: 400, statusText: "The channel code is invalid." });
    }
    
    const userId = claim.id 

    const selectChannel = `
        SELECT * FROM Channels 
        WHERE Channels.join_url = $1`

    const selectChannelWithUser = `
        SELECT Channels.* FROM Channels 
        INNER JOIN UsersChannels ON Channels.id = UsersChannels.channel_id 
        WHERE Channels.join_url = $1 AND UsersChannels.user_id = $2`

    const getTaskQuery = `
        SELECT Tasks.*, Users.username, Users.email, Users.first_name, Users.last_name FROM Tasks
        INNER JOIN Channels On Tasks.channel_id = Channels.id
        INNER JOIN Users On Tasks.created_by = Users.id
        WHERE Tasks.id = $1`

    
    try {
        const channelFound = await pool.query(selectChannel, [code])
        if (channelFound.rowCount === 0) {
            return new Response(null, {status: 404, statusText: "The channel is not found"})
        }
        
        const channelFoundWithUser = await pool.query(selectChannelWithUser, [code, userId])
        if (channelFoundWithUser.rowCount === 0) {
            return new Response(null, {status: 403, statusText: "The channel is found, but you are not a member"})
        }

        const { rowCount, rows } = await pool.query(getTaskQuery, [taskId])
        console.log(rows)
        if (rowCount > 0) {
            return new Response(JSON.stringify(rows[0]),
            {status: 200, statusText: `A task has been found.`})
        }
        
        return new Response(null, {status: 404, statusText: "No task has been found."})
    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error)
    }

    return new Response(null, {status: 500, statusText: "The error has occurred while pulling the task data."})
}