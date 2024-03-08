
'use client'
import { useEffect, useState } from "react"
import { GroupDetailsModal, GroupList, JoinGroupButton} from "../../components/group"
import { TaskList, TaskCreationModal} from "../../components/task"
import { redirectTo, getSession, getTasks, getGroup, deleteTask} from "../../lib/actions"
import { usePathname } from 'next/navigation'

export default function SpecificGroupPage({ params }) {
    const [session, setSession] = useState()
    const [tasks, setTasks] = useState()
    const [group, setGroup] = useState()

    useEffect(()=>{
        (async() => {
            const response1 = await getSession()
            setSession(response1)
            
            const response2 = await getTasks(params.code)
            if (response2?.ok){
                setTasks(response2.data)
            }

            const response3 = await getGroup(params.code)
            if (response3?.ok) {
                setGroup(response3.data)
            }

            
        })()
    }, [])

    useEffect(() => {
        if (session && !session?.ok){
            redirectTo('/signin')
        }

    }, [session])

    const onDeleteTask = async (taskId) => {
        const response = await deleteTask(params.code, taskId);
        if (response?.ok) {
            setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
        } else {
            console.error("Failed to delete the task");
        }
    };

    
    if (!session || !session?.ok) {
        return null
    }


    return (
        <>
            <div className="min-h-screen flex">
                <GroupList/>
                <div className="flex flex-col p-4">
                    <p>{ params.code }</p>
                    <GroupDetailsModal group={group} />
                    <TaskCreationModal channel={params.code}/>
                    <TaskList channel={params.code} tasks={tasks} onDeleteTask={onDeleteTask}/>
                    <JoinGroupButton code={params.code}/>
                </div>
            </div>
        </>
    )
}