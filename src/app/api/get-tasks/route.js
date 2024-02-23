import pool from "../middleware/database"
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions"

export default async function GET(req) {
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }
    
    const code = req.nextUrl.split('/')[parseInt.length - 1]

    const getTasksQuery = `
    SELECT Tasks.* FROM Tasks
    INNER JOIN Channels On Tasks.channel_id = Channel.id
    WHERE Channel.join_url = $1`

    try {
        const { rowCount, rows } = await pool.query(getTasksQuery, [code])
        if (rowCount > 0) {
            return new Response(JSON.stringify(rows),
            {status: 200, statusText: `${rowCount} tasks have been found.`})
        }
        
        return new Response(null, {status: 404, statusText: "No tasks has been found."})
    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error)
    }

    return new Response(null, {status: 500, statusText: "The error has occurred while pulling the task data."})
}