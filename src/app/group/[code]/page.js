'use client'
import { redirect } from "next/navigation"
import { GroupOverview, GroupList } from "../../components/group"
import { TaskBoard } from "../../components/task"
import { getSession, getGroup, getComments} from "../../lib/actions"
import { useEffect, useState } from "react"
import { Loading } from "../../components/utils"
import { CommentsList, SearchComment, SendComment } from "../../components/comment"

export default function SpecificGroupPage({ params }) {
    const [session, setSession] = useState()
    const [group, setGroup] = useState()
    const [isLoading, setLoading] = useState(true)
    const [comments, setComments] = useState([])
    const [commentUpdated, setCommentUpdated] = useState(0)
    const [query, setQuery] = useState('')

    // get session and group data on mount
    useEffect(()=> {
        (async()=>{
            setSession(await getSession())
            setGroup(await getGroup(params.code))
        })()
    }, [])

    // when comment and search field are changed, retrieve the comments again.
    useEffect(()=>{
        (async()=>{
            setComments(await getComments(params.code, query))
        })()
    }, [commentUpdated, query])
    
    // redirection based on the session and group fetch results
    useEffect(()=>{
        if (group?.ok) {
            setLoading(false)
        }
        
        if (session && !session?.ok){
            redirect(`/signin?destination_url=${params.code}`)
        }

        if (session && session?.ok && group && !group?.ok) {
            redirect(`/group/${params.code}/join`)
        }

    }, [session, group])
    
    if (isLoading) { return <Loading/> }

    return (
        <>
            <div className="min-h-max flex pt-16">
                <GroupList channel={params.code}/>
                <div className="flex flex-col w-full p-4 space-y-4">
                    <div className="shadow-lg p-4 border-gray-300 rounded-lg border">
                        <GroupOverview group={group}/>
                    </div>
                    <div className="flex flex-col space-y-6">
                        <div className="shadow-lg p-4 border-gray-300 rounded-lg border">
                            <TaskBoard channel={params.code}/>
                        </div>
                        <div className="shadow-lg p-4 border-gray-300 rounded-lg border">
                            <CommentsList comments={comments?.data} onSearch={setQuery}/>
                            <SendComment channel={params.code} onUpdate={()=>setCommentUpdated(commentUpdated+1)}/>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}