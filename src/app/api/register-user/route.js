import pool from "@/app/utils/database"
import bcrypt from 'bcryptjs'

export async function POST ( req ){
    const {email, password, username, firstname, lastname} = await req.json()

    if (!isValidEmail(email) || !isValidPassword(password)) {
        return new Response(null, { status: 400 })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const values = [email, hashedPassword, username, firstname, lastname]
    
    const lookup_query = 'SELECT * FROM Users WHERE email = $1 LIMIT 1'
    const insert_query = `
    INSERT INTO Users (email, password_hash, username, first_name, last_name)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`


    try{
        const lookup_response = await pool.query(lookup_query, [email])
        if (lookup_response.rowCount > 0) {
            return new Response(null, { status: 409 })    
        }
        
        const { rowCount, rows } = await pool.query(insert_query, values);
        if (rowCount > 0) {
            console.log(rows[0])
            return new Response(JSON.stringify(rows[0]), { status: 201 })
        } else {
            return new Response(null, { status: 400 })
        }
        
    } catch (error) {
        console.log(error)
        return new Response('', { status: 500 })
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