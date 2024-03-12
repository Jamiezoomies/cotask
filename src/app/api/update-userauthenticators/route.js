import pool from "../middleware/database";
import bcrypt from "bcryptjs";
import {createJwtToken, getClaimFromJwtToken, getJwtTokenFromHeaders} from "../lib/actions";

export async function POST(req) {
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }

    const userId = claim.id

    const {email, password, new_email, new_password} = await req.json()

    if (!isValidEmail(new_email) || !isValidPassword(new_password)) {
        return new Response(null, { status: 400 })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(new_password, saltRounds)

    const userValues = [new_email, hashedPassword, userId]

    const auth_query = `
    SELECT email, password_hash
    FROM Users
    WHERE id = $1`;

    const update_query = `
    UPDATE Users
    SET email = $1, password_hash = $2
    WHERE id = $3`;

    try {
        const { rows } = await pool.query(auth_query, [userId])
        if (rows.length > 0) {
            const user = rows[0]
            const isPasswordMatched = await bcrypt.compare(password, user.password_hash)
            if (user.email !== email || !isPasswordMatched) {
                return new Response(null, { status: 401, statusText: "Incorrect email or password." })
            }
        } else {
            return new Response(null, { status: 404, statusText: "User not found." })
        }

        const updateResponse = await pool.query(update_query, userValues)
        if (updateResponse.rowCount > 0) {
            return new Response(null, { status: 201, statusText: "The profile has been updated successfully."})
        } else {
            return new Response(null, { status: 404, statusText: "User not found." })
        }
    } catch (error) {
        console.error(error)
        return new Response(null, { status: 500, statusText: "An internal error has occurred."})
    }
}

function isValidEmail (email) {
    const regex = /^[a-zA-z0-9._-]+@[a-zA-z0-9.-]+\.[a-zA-z]{2,}$/
    return regex.test(email)
}

function isValidPassword (password) {
    const regex = /^.{8,}$/
    return regex.test(password)
}
