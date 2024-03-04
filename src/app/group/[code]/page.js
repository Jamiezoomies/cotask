
'use client'
import { useEffect, useState } from "react"
import { GroupDetailsModal, GroupList, JoinGroupButton} from "../../components/group"
import { TaskList, TaskCreationModal} from "../../components/task"
import { redirectTo, getSession } from "../../lib/actions"
import { usePathname } from 'next/navigation'

export default function SpecificGroupPage({ params }) {
    const [session, setSession] = useState()
    useEffect(()=>{
        (async() => {
            const res = await getSession()
            setSession(res)
            
        })()
    }, [])

    useEffect(() => {
        if (session && !session?.ok){
            redirectTo('/signin')
        }     
    }, [session])

    
    
    if (!session || !session?.ok) {
        return null
    }


    return (
        <>
            <div className="min-h-screen flex">
                <GroupList/>
                <div className="flex flex-col p-4">
                    <p>{ params.code }</p>
                    <GroupDetailsModal join_url= { usePathname() }/>
                    <TaskCreationModal channel={params.code}/>
                    <TaskList channel={params.code}/>
                    <JoinGroupButton code={params.code}/>
                </div>
            </div>
        </>
    )
}

/*
const SESSION_API_URL = '/api/session'
const TOKEN_TYPE = 'Bearer'
const SESSION_COOKIE_NAME = 'jwt'

async function getSession() {
    try {
        const response = await fetch(SESSION_API_URL, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `${TOKEN_TYPE} ${cookies.get(SESSION_COOKIE_NAME)}`
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

*/