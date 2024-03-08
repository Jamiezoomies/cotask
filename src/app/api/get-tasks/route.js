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
    const status = searchParams.get('status')

    if (!code) {
        return new Response(null, { status: 400, statusText: "The channel code is invalid." });
    }
    
    const userId = claim.id 

    const selectChannel = `
        SELECT id FROM Channels 
        WHERE Channels.join_url = $1`
        
    const selectChannelWithUser = `
        SELECT id FROM Channels 
        INNER JOIN UsersChannels ON Channels.id = UsersChannels.channel_id 
        WHERE Channels.join_url = $1 AND UsersChannels.user_id = $2`

    var getTasksQuery = `
        SELECT Tasks.* FROM Tasks
        INNER JOIN Channels On Tasks.channel_id = Channels.id
        WHERE Channels.join_url = $1`
    const tasksQueryParams = [code]

    if (status !== null) {
        getTasksQuery += ` AND Tasks.status = $2`
        tasksQueryParams.push(status)
    }

    
    try {
        

        const { rowCount, rows } = await pool.query(getTasksQuery, tasksQueryParams)
        if (rowCount > 0) {
            return new Response(JSON.stringify(rows),
            {status: 200, statusText: `${rowCount} tasks have been found.`})
        }
        
        return new Response(null, {status: 404, statusText: "No task has been found."})
    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error)
    }

    return new Response(null, {status: 500, statusText: "The error has occurred while pulling the task data."})
}