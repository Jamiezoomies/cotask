'use client'
import { useEffect, useState } from "react"
import { getSession, getTasks } from "../../../lib/actions"
import { JoinGroupButton } from "../../../components/group"

export default function Join({ params }) {
    const [session, setSession] = useState(null)
    const [isMember, setIsMember] = useState(false)

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
                if (response?.status === 403) {
                    setIsMember(false)
                    setMsg(response.msg)
                } else {
                    setIsMember(true)
                }
            }
        })()
    }, [session])
    
    

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded pt-12 pb-10 px-8 flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold">Welcome to Our Channel!</h1>
                { !isMember ? (
                <>
                    <p className="my-3 text-lg">If you're not a member yet, join us to start collaborating.</p>
                    <JoinGroupButton code={params.code} />
                </>
                ):(
                <p className="my-3 text-lg">You're already a member</p>)
                }
          </div>     
        </div> 
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