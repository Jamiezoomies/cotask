'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET_KEY = 'TEST'
const JWT_COOKIE_NAME = 'jwt'
const JWT_COOKIE_EXPIRY = '6h'

const URL_SIGNIN = '/signin'
const URL_SIGNUP = '/signup'
const URL_HOME = '/home'
const URL_LOGOUT = '/logout2'

async function handleSignIn(data) {
    const token = await createJwtCookie(data)
    if (token) {
        redirect(URL_HOME)
    }
}

async function handleSignUp(data) {
    const token = await createJwtCookie(data)
    if (!token) {
        redirect(URL_SIGNUP)
    } else {
        redirect(URL_HOME)
    }
}

async function handleLogout() {
    cookies().set(JWT_COOKIE_NAME, '', { maxAge: 0 })
    redirect(URL_LOGOUT)
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
        console.log(cookies().has(JWT_COOKIE_NAME))
        if (cookies().has(JWT_COOKIE_NAME) && cookies().get(JWT_COOKIE_NAME).value != '') {
            const token = cookies().get(JWT_COOKIE_NAME).value
            return jwt.verify(token, JWT_SECRET_KEY)
        }
        return null

    } catch (error) {
        console.log(error)
        return null
    }
}

export { handleSignIn, handleSignUp, handleLogout, onlyForAuthorized, redirectAuthorized}