'use client'
import { useEffect, useState } from "react"
import { getSession, getTasks } from "../../../lib/actions"
import { JoinGroupButton } from "../../../components/group"

export default function Join({ params }) {
    const [session, setSession] = useState(null)
    const [msg, setMsg] = useState(null)

    useEffect(() => {
        (async () => {
            const response = await getSession()
            console.log(response)
            setSession(response)
        })()
    }, [])
    
    useEffect(() => {
        (async () => {
            console.log(params.code)
            if (session && session?.ok) {
                const response = await getTasks(params.code)
                console.log(response)
                setMsg(response.msg)
            } else {
                setMsg("Session dead")
            }
        })()
    }, [session])
    
    return (
        <>
            <p>is this user a member of the channel?</p>
            <p>{msg}</p>
            <JoinGroupButton code={params.code}/>
        </>
    )
}

async function fetchTasks(code) {
    const GET_TASKS_API_URL = '/api/get-tasks'
    try{
        const params = `?code=${code}`
        const response = await fetch(process.env.BASE_URL + GET_TASKS_API_URL + params, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': getAuth()
            }
        })
        
        if (response.status === 200) {
            return { ok: true, msg: response.statusText, data: await response.json()}
        } else if ([400, 401, 404, 500].includes(response.status)) {
            return { ok: false, msg: response.statusText, data: null}
        }
    } catch (error) {
        console.log(error)
    }

    return { ok: false, msg: "Unexpected error has occurred", data: null }
}