import pool from "../middleware/database";
import bcrypt from "bcryptjs";
import {getClaimFromJwtToken, getJwtTokenFromHeaders} from "../lib/actions";

export async function POST(req) {
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }

    const userId = claim.id

    const {username, bio} = await req.json()

    const userValues = [username, bio, userId]

    const query = `
    UPDATE Users
    SET username = $1, bio = $2
    WHERE id = $3`;

    try {
        const updateUserResponse = await pool.query(query, userValues)
        if (updateUserResponse.rowCount > 0) {
            return new Response(null, { status: 201, statusText: "The profile has been updated successfully."})
        } else {
            return new Response(null, { status: 404, statusText: "User not found." })
        }
    } catch (error) {
        console.error(error)
        return new Response(null, { status: 500, statusText: "An internal error has occurred."})
    }
}