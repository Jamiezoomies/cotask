import pool from "/src/app/utils/database"
import bcrypt from 'bcryptjs'

export async function POST ( req ){
    const {email, password} = await req.json()

    if (!isValidEmail(email) || !isValidPassword(password)) {
        return new Response(null, { status: 400 })
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const values = [email, hashedPassword]
    
    const lookup_query = 'SELECT * FROM Users WHERE email = $1 LIMIT 1'

    try{
        const { rowCount, rows } = await pool.query(lookup_query, [email])
        if (rowCount > 0) {
            const user = rows[0]
            const isPasswordMatched = await bcrypt.compare(password, user.password_hash)
            
            if (isPasswordMatched) {
                return new Response(JSON.stringify(rows[0]), { status: 200 })
            }
        } 
        
        return new Response("Invalid email or password", { status: 400})

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