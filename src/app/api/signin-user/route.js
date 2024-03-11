import pool from "../middleware/database"
import bcrypt from 'bcryptjs'
import { createJwtToken } from '../lib/actions'

export async function POST ( req ){
    const {email, password} = await req.json()

    if (!isValidEmail(email) || !isValidPassword(password)) {
        return new Response(null, { status: 400 })
    }
    
    const lookupQuery = 'SELECT * FROM Users WHERE email = $1 LIMIT 1'

    try{
        const { rowCount, rows } = await pool.query(lookupQuery, [email])
        if (rowCount > 0) {
            const found = rows[0]
            const isPasswordMatched = await bcrypt.compare(password, found.password_hash)
            
            if (isPasswordMatched) {
                return new Response(JSON.stringify(await createJwtToken(found)), 
                { status: 200, statusText: "Welcome back! You've successfully signed in."})
            } else {
                return new Response(null, { status: 401, statusText: "Oops! It looks like the password is incorrect. Please try again."})
            }
        } 
        
        return new Response(null, { status: 404, statusText: "Oops! It looks like the email is incorrect. Please try again."})
    } catch (error) {
        console.log(error)
        return new Response(null, { status: 500, statusText: "The internal error has occurred."})
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