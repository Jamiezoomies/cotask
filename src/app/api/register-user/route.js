import pool from "../middleware/database"
import bcrypt from 'bcryptjs'

export async function POST(req) {
    const {email, password, username, firstname, lastname} = await req.json()

    if (!isValidEmail(email) || !isValidPassword(password)) {
        return new Response(null, { status: 400 })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const defaultImage = 'https://tr.rbxcdn.com/70108dc7da4e002c8e5d2c1dcf0825fb/420/420/Hat/Png'
    const defaultBio = 'This is a default bio.'
    const userValues = [email, hashedPassword, username, firstname, lastname, defaultImage, defaultBio]
    
    const lookup_query = 'SELECT * FROM Users WHERE email = $1 LIMIT 1'
    const insert_user_query = `
    INSERT INTO Users (email, password_hash, username, first_name, last_name, profile_picture_url, bio)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, username, email, first_name, last_name, profile_picture_url, bio`

    try {
        const lookupResponse = await pool.query(lookup_query, [email])
        if (lookupResponse.rowCount > 0) {
            return new Response(null, { status: 409, statusText: "The user already exists."})    
        }
        
        const insertUserResponse = await pool.query(insert_user_query, userValues)
        if (insertUserResponse.rowCount > 0) {
            const user = insertUserResponse.rows[0];
            return new Response(JSON.stringify(user), { status: 201, statusText: "The user has been registered successfully."})
        } else {
            return new Response(null, { status: 500, statusText: "An error occurred while creating the user." })
        }
    } catch (error) {
        console.log(error)
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