'use server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const URL_SIGNIN = '/signin'
const URL_LOGOUT = '/logout'

const BASE_URL = process.env.BASE_URL
const REGISTER_API_URL = '/api/register-user'
const SIGNIN_API_URL = '/api/signin-user'
const SESSION_API_URL = '/api/session'
const GROUP_CREATE_API_URL = '/api/create-group'
const GET_GROUPS_API_URL = '/api/get-groups'
const TASK_CREATE_API_URL = '/api/create-task'
const GET_TASKS_API_URL = '/api/get-tasks'
const GET_USERPROFILE_API_URL = '/api/get-userprofile'

const TOKEN_TYPE = 'Bearer'
async function handleSignIn(formData) {    
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    }
    const response = await fetch(BASE_URL + SIGNIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application.json'},
        body: JSON.stringify(data)
    })

    var result = {}
    if (response.status === 200) {
        cookies().set('jwt', await response.json())
        result = { ok: true, msg: response.statusText };
    } else if ([401, 404, 500].includes(response.status)) {
        result = { ok: false, msg: response.statusText};
    } else {
        result = { ok: false, msg: "Unexpected error has occurred"};
    }

    return result
}

async function handleSignUp(formData) {
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        username: formData.get('username'),
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname')
    }

    const response = await fetch(BASE_URL + REGISTER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application.json'},
        body: JSON.stringify(data)
    })

    var result = {}
    if (response.status === 201) {
        cookies().set('jwt', await response.json())
        result = { ok: true, msg: response.statusText };
    } else if ([400, 409, 500].includes(response.status)) {
        result = { ok: false, msg: response.statusText};
    } else {
        result = { ok: false, msg: "Unexpected error has occurred" };
    }

    return result
}

async function handleLogout() {
    cookies().set(JWT_COOKIE_NAME, '', { maxAge: 0 })
    redirect(URL_LOGOUT)
}

// Redirect unauthorized users to `sign-in` and return the session.
async function protectFromUnauthorized() {
    try {
        const response = await fetch(BASE_URL + SESSION_API_URL, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application.json',
                'Authorization': `${TOKEN_TYPE} ${cookies().get('jwt')?.value}`
            }
        })

        if (response.status === 200) {
            return await response.json()
        }
        
    } catch (error) {
        console.log(error)
    }
    
    redirect(BASE_URL+URL_SIGNIN)
}

// Direct authorized users to `url`.
async function redirectAuthorizedTo(url) {
    try {
        const response = await fetch(BASE_URL + SESSION_API_URL, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application.json',
                'Authorization': `${TOKEN_TYPE} ${cookies().get('jwt')?.value}`
            }
        })
        
        if (response.status === 200) {
            redirect(BASE_URL+url)
        }

    } catch (error) {
        console.log(error)
    }
}

async function createGroup(formData) {
    const data = {
        name: formData.get('name'),
        description: formData.get('description'),
    }

    const response = await fetch(BASE_URL + GROUP_CREATE_API_URL, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application.json',
            'Authorization': `${TOKEN_TYPE} ${cookies().get('jwt')?.value}`
        },
        body: JSON.stringify(data)
    })

    var result = {}
    if (response.status === 201) {
        result = { ok: true, msg: response.statusText, data: await response.json()};
    } else if ([401, 500].includes(response.status)) {
        result = { ok: false, msg: response.statusText, data: null};
    } else {
        result = { ok: false, msg: "Unexpected error has occurred" };
    }

    return result
}

async function getGroups() {
    try{
        const response = await fetch(BASE_URL + GET_GROUPS_API_URL, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application.json',
                'Authorization': `${TOKEN_TYPE} ${cookies().get('jwt')?.value}`
            }
        })

        var result = {}
        if (response.status === 200) {
            result = { ok: true, msg: response.statusText, data: await response.json()};
        } else if ([401, 404, 500].includes(response.status)) {
            result = { ok: false, msg: response.statusText, data: null};
        } else {
            result = { ok: false, msg: "Unexpected error has occurred" };
        }
    } catch (error) {
        console.log(error)
    }

    return result
}

async function getUserProfile() {
    try {
        const token = cookies().get('jwt')?.value; 
        const response = await fetch(BASE_URL + GET_USERPROFILE_API_URL, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `${TOKEN_TYPE} ${token}` 
            }
        });

        var result = {};
        if (response.status === 200) {
            result = { ok: true, msg: response.statusText, data: await response.json()};
        } else if ([401, 404, 500].includes(response.status)) {
            result = { ok: false, msg: response.statusText, data: null};
        } else {
            result = { ok: false, msg: "Unexpected error has occurred", data: null };
        }
    } catch (error) {
        console.log(error);
        result = { ok: false, msg: error.toString(), data: null };
    }

    return result;
}


async function createTask(channel, formData) {
    try{
        const data = {
            code: channel,
            title: formData.get('title'),
            description: formData.get('description'),
            dueDate: formData.get('due_date'),
        }

        const response = await fetch(BASE_URL + TASK_CREATE_API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application.json',
                'Authorization': `${TOKEN_TYPE} ${cookies().get('jwt')?.value}`
            },
            body: JSON.stringify(data)
        })

        var result = {}
        if (response.status === 201) {
            result = { ok: true, msg: response.statusText, data: await response.json()};
        } else if ([401, 500].includes(response.status)) {
            result = { ok: false, msg: response.statusText, data: null};
        } else {
            result = { ok: false, msg: "Unexpected error has occurred" };
        }
    } catch (error) {
        console.log(error)
    }
    console.log(result)
    return result
}


async function getTasks(code) {
    try{
        const params = `?code=${code}`
        const response = await fetch(BASE_URL + GET_TASKS_API_URL + params, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application.json',
                'Authorization': `${TOKEN_TYPE} ${cookies().get('jwt')?.value}`
            }
        })
        
        var result = {}
        if (response.status === 200) {
            result = { ok: true, msg: response.statusText, data: await response.json()};
        } else if ([400, 401, 404, 500].includes(response.status)) {
            result = { ok: false, msg: response.statusText, data: null};
        } else {
            result = { ok: false, msg: "Unexpected error has occurred" };
        }
    } catch (error) {
        console.log(error)
    }

    return result
}

export { handleSignIn, handleSignUp, handleLogout, protectFromUnauthorized, redirectAuthorizedTo, createGroup, getGroups, getUserProfile, createTask, getTasks}