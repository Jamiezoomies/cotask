'use client'
import { redirect } from "next/navigation"
import { GroupOverview, GroupList } from "../../components/group"
import { TaskBoard } from "../../components/task"
import { getSession, getGroup} from "../../lib/actions"
import { useEffect, useState } from "react"
import { Loading } from "../../components/utils"

export default function SpecificGroupPage({ params }) {
    const [session, setSession] = useState()
    const [group, setGroup] = useState()
    const [isLoading, setLoading] = useState(true)

    useEffect(()=> {
        (async()=>{
            setSession(await getSession())
            setGroup(await getGroup(params.code))
            
        })()

        
    }, [])
    
    useEffect(()=>{
        if (group?.ok) {
            setLoading(false)
        }
        
        if (session && !session?.ok){
            redirect(`/signin?destination_url=${params.code}`)
        }
        console.log(group)
        if (session && session?.ok && group && !group?.ok) {
            redirect(`/group/${params.code}/join`)
        }

    }, [session, group])
    
    if (isLoading) { return <Loading/> }

    return (
        <>
            <div className="min-h-max flex pt-16">
                <GroupList channel={params.code}/>
                <div className="flex flex-col w-full p-4">
                    <GroupOverview group={group}/>
                    <div className="flex flex-col">
                        <TaskBoard channel={params.code}/>
                    </div>
                </div>

            </div>
        </>
    )
}