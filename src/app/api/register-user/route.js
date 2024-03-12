import pool from "../middleware/database"
import bcrypt from 'bcryptjs'

export async function POST ( req ){
    const {email, password, username, firstname, lastname} = await req.json()

    if (!isValidEmail(email)) {
        return new Response(null, { status: 400, statusText: "Oops! The email is not valid format." })
    }

    if (!isValidPassword(password)) {
        return new Response(null, { status: 400, statusText: "Oops! The password must be at least 8 characters long." })
    }

    // Hash Password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const values = [email, hashedPassword, username, firstname, lastname]
    
    // SQL query to look up the email
    const lookup_query = 'SELECT * FROM Users WHERE email = $1 LIMIT 1'

    // SQL query to insert the user with data
    const insert_query = `
    INSERT INTO Users (email, password_hash, username, first_name, last_name)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`


    try{
        const lookupResponse = await pool.query(lookup_query, [email])
        if (lookupResponse.rowCount > 0) {
            return new Response(null, { status: 409, statusText: "The user already exists."})    
        }
        
        const { rowCount, rows } = await pool.query(insert_query, values);
        if (rowCount > 0) {
            return new Response(JSON.stringify(rows[0]), { status: 201, statusText: "The user has been registered."})
        }
        
        return new Response(null, { status: 500, statusText: "The error has occurred while inserting and returning data." })
        
    } catch (error) {
        console.log(error)
        return new Response(null, { status: 500, statusText: "An unexpected error has occurred."})
    }
}

// Email format validation.
function isValidEmail (email) {
    const regex = /^[a-zA-z0-9._-]+@[a-zA-z0-9.-]+\.[a-zA-z]{2,}$/
    return regex.test(email)
}

//Password format validation. The password must be at least 8 characters long.
function isValidPassword (password) {
    const regex = /^.{8,}$/
    return regex.test(password)
}