'use server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const BASE_URL = process.env.BASE_URL
const REGISTER_API_URL = '/api/register-user'
const SIGNIN_API_URL = '/api/signin-user'
const SESSION_API_URL = '/api/session'
const GROUP_CREATE_API_URL = '/api/create-group'
const GET_GROUP_API_URL = '/api/get-group'
const GET_GROUPS_API_URL = '/api/get-groups'
const TASK_CREATE_API_URL = '/api/create-task'
const GET_TASK_API_URL = '/api/get-task'
const GET_TASKS_API_URL = '/api/get-tasks'
const EDIT_TASK_API_URL = '/api/edit-task'
const DELETE_TASK_API_URL = '/api/delete-task'
const JOIN_GROUP_API_URL = '/api/join-group'
const TOKEN_TYPE = 'Bearer'
const SESSION_COOKIE_NAME = 'jwt'

function getAuth() {
    const auth = `${TOKEN_TYPE} ${cookies().get(SESSION_COOKIE_NAME)?.value}`
    return auth
}

async function handleSignIn(formData) {    
    try {
        const data = {
            email: formData.get('email'),
            password: formData.get('password')}
    
        const response = await fetch(BASE_URL + SIGNIN_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data)})

        if (response.status === 200) {
            cookies().set(SESSION_COOKIE_NAME, await response.json())
            return { ok: true, msg: response.statusText };
        } else if ([401, 404, 500].includes(response.status)) {
            return { ok: false, msg: response.statusText};
        }

    } catch (error){
        console.log(error)
    }

    return {ok: false, msg: "An unknown error has occurred"}
}

async function handleSignUp(formData) {
    try{
        const data = {
            email: formData.get('email'),
            password: formData.get('password'),
            username: formData.get('username'),
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname')}

        const response = await fetch(BASE_URL + REGISTER_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data)})

        if (response.status === 201) {
            return { ok: true, msg: response.statusText };
        } else if ([400, 409, 500].includes(response.status)) {
            return { ok: false, msg: response.statusText};
        } 

    } catch (error){
        console.log(error)
    }

    return {ok: false, msg: "An unknown error has occurred"}
}

async function handleLogout() {
    cookies().set(JWT_COOKIE_NAME, '', { maxAge: 0 })
    redirect(URL_LOGOUT)
}

async function getSession() {
    try {
        const response = await fetch(BASE_URL + SESSION_API_URL, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getAuth()
            }})
        if (response.status === 200) {
            return {ok: true, msg: response.statusText, session: await response.json()};
        } else if ([401, 500].includes(response.status)){
            return {ok: false, msg: response.statusText, session: null};
        }
    } catch (error) {
        console.log(error)
    }

    return {ok: false, msg: "An unknown error has occurred", session: null};
}

async function redirectTo(url){
    redirect(BASE_URL + url)
}

async function createGroup(data) {
    try{
        const response = await fetch(BASE_URL + GROUP_CREATE_API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getAuth()
            },
            body: JSON.stringify(data)
        })

        if (response.status === 201) {
            return {ok: true, msg: response.statusText, data: await response.json()}
        } else if ([401, 500].includes(response.status)) {
            return { ok: false, msg: response.statusText, data: null}
        }
    } catch (error) {
        console.log(error)
    }

    return { ok: false, msg: "Unexpected error has occurred", data: null }
}

async function getGroups() {
    try{
        const response = await fetch(BASE_URL + GET_GROUPS_API_URL, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getAuth() }})

        if (response.status === 200) {
            return { ok: true, msg: response.statusText, data: await response.json()};
        } else if ([401, 404, 500].includes(response.status)) {
            return { ok: false, msg: response.statusText, data: null};
        }

    } catch (error) {
        console.log(error)
    }

    return { ok: false, msg: "Unexpected error has occurred", data: null};
}

async function getGroup(code) {
    try {
        const params = `?code=${code}`
        const response = await fetch(BASE_URL + GET_GROUP_API_URL + params, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getAuth()
            }
        })
        
        if (response.status === 200) {
            return { ok: true, msg: response.statusText, data: await response.json()}
        } else if ([400, 401, 403, 404, 500].includes(response.status)) {
            return { ok: false, msg: response.statusText, data: null}
        }

    } catch (error) {
        console.error(error)
    }
}


async function joinGroup(data) {
    let response
    
    try {
        response = await fetch(BASE_URL + JOIN_GROUP_API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getAuth() },
            body: JSON.stringify(data)
            })
        
        if (response.status === 201) {
            return { ok: true, msg: response.statusText, data: await response.json()};
        } else if ([400, 401, 404, 409, 500].includes(response.status)) {
            return { ok: false, msg: response.statusText, data: null};
        }
    } catch (error) {
        console.log(error)
    }

    return { ok: false, msg: response.statusText || "Unexpected error has occurred", data: null};
}

async function createTask(channel, formData) {
    try{
        const data = {
            code: channel,
            title: formData.get('title'),
            description: formData.get('description'),
            dueDate: formData.get('due_date')}
            
        console.log(data)
        const response = await fetch(BASE_URL + TASK_CREATE_API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getAuth()
            },
            body: JSON.stringify(data)})

        if (response.status === 201) {
            return { ok: true, msg: response.statusText, data: await response.json()}
        } else if ([401, 500].includes(response.status)) {
            return { ok: false, msg: response.statusText, data: null}
        } 
    } catch (error) {
        console.log(error)
    }

    return { ok: false, msg: "Unexpected error has occurred", data: null }
}

async function getTasks(code, status) {
    try{
        const params = `?code=${code}${status != null ? `&status=${status}` : ''}`;
        const response = await fetch(BASE_URL + GET_TASKS_API_URL + params, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getAuth()
            }
        })
        
        if (response.status === 200) {
            return { ok: true, status: response.status, msg: response.statusText, data: await response.json()}
        } else if ([400, 401, 403, 404, 500].includes(response.status)) {
            return { ok: false, status: response.status, msg: response.statusText, data: null}
        }
    } catch (error) {
        console.log(error)
    }

    return { ok: false, msg: "Unexpected error has occurred", data: null }
}

async function getTask(code, id) {
    try {
        const params = `?code=${code}&id=${id}`
        const response = await fetch(BASE_URL + GET_TASK_API_URL + params, {
            method: 'GET',
            headers: { 
                'Authorization': getAuth()
            }
        })
        
        if (response.status === 200) {
            return { ok: true, msg: response.statusText, data: await response.json()}
        } else if ([400, 401, 403, 404, 500].includes(response.status)) {
            return { ok: false, msg: response.statusText, data: null}
        }

    } catch (error) {
        console.error(error)
    }
}

async function editTask(data, code, id) {
    try{
        const params = `?code=${code}&id=${id}`
        const response = await fetch(BASE_URL + EDIT_TASK_API_URL + params, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuth()
            },
            body: JSON.stringify(data)
        })
        var result = {}
        if (response.status === 201) {
            result = { ok: true, msg: response.statusText };
        } else if ([401, 404, 500].includes(response.status)) {
            result = { ok: false, msg: response.statusText};
        } else {
            result = { ok: false, msg: "Unexpected error has occurred" };
        }
    } catch(error){
        console.log(error)
    }
    return result
}

async function deleteTask(channel, id) {
    try{
        const params = `?channel=${channel}&id=${id}`
        const response = await fetch(BASE_URL + DELETE_TASK_API_URL + params, {
            method: 'DELETE',
            headers: {
                'Authorization': getAuth()
            }
        })
        var result = {}
        if (response.status === 200) {
            result = { ok: true, msg: response.statusText };
        } else if ([401, 500].includes(response.status)) {
            result = { ok: false, msg: response.statusText};
        } else {
            result = { ok: false, msg: "Unexpected error has occurred" };
        }
    } catch(error){
        console.log(error)
    }
    return result
}

export { getAuth, handleSignIn, handleSignUp, handleLogout, getSession, redirectTo,
    createGroup, getGroups, getGroup, joinGroup, createTask, getTasks, getTask, editTask, deleteTask}