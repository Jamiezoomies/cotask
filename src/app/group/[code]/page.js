'use client'
import { redirect } from "next/navigation"
import { GroupDetailsModal, GroupList } from "../../components/group"
import { TaskBoard } from "../../components/task"
import { getSession, getGroup} from "../../lib/actions"
import { useEffect, useState } from "react"

export default function SpecificGroupPage({ params }) {
    const [session, setSession] = useState()
    const [group, setGroup] = useState()

    useEffect(()=> {
        (async()=>{
            setSession(await getSession())
            setGroup(await getGroup(params.code))
        })()
    }, [])
    
    
    if (!session?.ok){
        redirect(`/signin?destination_url=${params.code}`)
    }

    return (
        <>
            <div className="min-h-screen flex">
                <GroupList channel={params.code}/>
                <div className="flex flex-col w-full p-4">
                    <div className="flex flex-col p-4 bg-white rounded-lg shadow-md border border-black">
                        <h3 className="text-xl font-semibold text-gray-800">{group?.data?.name}</h3>
                        <p className="text-gray-600 mt-2">{group?.data?.description}</p>
                        <p className="text-sm text-gray-500 mt-4">Code: <span className="font-medium text-gray-700">{params.code}</span></p>
                        <GroupDetailsModal group={group?.data} />
                    </div>
                    <div className="flex flex-col">
                        <TaskBoard channel={params.code}/>
                    </div>
                </div>
            </div>
        </>
    )
}