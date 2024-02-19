'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET_KEY = 'TEST'
const JWT_COOKIE_NAME = 'jwt'
const JWT_COOKIE_EXPIRY = '6h'

async function handleSignIn(data) {
    const token = await createJwtCookie(data)
    if (token) {
        redirect('/home')
    }
}

async function handleSignUp(data) {
    const token = await createJwtCookie(data)
    if (!token) {
        redirect('/signup')
    } else {
        redirect('/home')
    }
}

// unauthorized users will be redirected to `sign-in`
async function onlyForAuthorized() {
    const user = await getDataFromJwtCookie()
    if (!user) {
        redirect('/signin') 
    }
    return user
}

// authorized users will be redirected to `url`
async function redirectAuthorized(url) {
    const user = await getDataFromJwtCookie()
    if (user) {
        redirect(url)
    }
    return user
}

async function createJwtCookie(data) {
    const payload = {
        id: data.id,
        email: data.email,
        username: data.username
    }

    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_COOKIE_EXPIRY })
    cookies().set(JWT_COOKIE_NAME, token)
    return token
}

async function getDataFromJwtCookie() {
    try {
        if (cookies().has(JWT_COOKIE_NAME)) {
            const token = cookies().get(JWT_COOKIE_NAME).value
            return jwt.verify(token, JWT_SECRET_KEY)
        }
        return null

    } catch (error) {
        console.log(error)
    }
}

export { handleSignIn, handleSignUp, onlyForAuthorized, redirectAuthorized}