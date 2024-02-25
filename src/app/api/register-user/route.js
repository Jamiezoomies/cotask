import pool from "../middleware/database"
import bcrypt from 'bcryptjs'


export async function POST(req) {
    const {email, password, username, firstname, lastname} = await req.json()

    if (!isValidEmail(email) || !isValidPassword(password)) {
        return new Response(null, { status: 400 })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const userValues = [email, hashedPassword, username, firstname, lastname]
    
    const lookup_query = 'SELECT * FROM Users WHERE email = $1 LIMIT 1'
    const insert_user_query = `
    INSERT INTO Users (email, password_hash, username, first_name, last_name)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id` // Assuming 'id' is the primary key and is returned upon successful insertion

    const defaultImage = '/path/to/default/image'
    const defaultBio = 'This is a default bio.'

    try {
        const lookupResponse = await pool.query(lookup_query, [email])
        if (lookupResponse.rowCount > 0) {
            return new Response(null, { status: 409, statusText: "The user already exists."})    
        }
        
        const insertUserResponse = await pool.query(insert_user_query, userValues)
        if (insertUserResponse.rowCount > 0) {
            const userId = insertUserResponse.rows[0].id 
            
            const insert_profile_query = `
            INSERT INTO UserProfile (user_id, image, bio)
            VALUES ($1, $2, $3)`
            await pool.query(insert_profile_query, [userId, defaultImage, defaultBio])

            return new Response(JSON.stringify({ userId, email, username, firstname, lastname, image: defaultImage, bio: defaultBio }), { status: 201, statusText: "The user and profile have been created."})
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