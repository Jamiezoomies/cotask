'use server'
import jwt from 'jsonwebtoken'

const JWT_SECRET_KEY = 'TEST'
const JWT_COOKIE_EXPIRY = '6h'

async function createJwtToken(data) {
    const payload = {
        id: data.id,
        email: data.email,
        username: data.username
    }

    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_COOKIE_EXPIRY })
    return token
}

async function getClaimFromJwtToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET_KEY)
    } catch (error) {
        return null
    }
}

function getJwtTokenFromHeaders(headers, type) {
    if (!headers) {
        return null
    }
    
    const authorizationHeader = headers.get('Authorization')

    if (authorizationHeader && authorizationHeader.startsWith(`${type} `)) {
        return authorizationHeader.substring(type.length + 1)
        
    } 
    return null
}


export {createJwtToken , getClaimFromJwtToken, getJwtTokenFromHeaders }