'use client'
import { useEffect, useState } from "react"
import { inviteUser } from "../../lib/actions"
import { GroupList } from "../../components/group"
import { TaskList, CreateTask } from "../../components/task"

export default function GroupPage({ params }) {

    const [joinURL, setJoinURL] = useState('');

    const invite = async () => {
        try {
            const data = await inviteUser(params.code); 
            setJoinURL(data.joinUrl); 
        } catch (error) {
            console.error("Error inviting user:", error);
        }
    };
    
    return (
        <>
            <div className="min-h-screen flex">
                <GroupList/>
                <div className="flex flex-col p-4">
                    <p>{ params.code }</p>
                    <TaskList channel={params.code}/>
                    <CreateTask channel={params.code}/>
                    <button 
                        className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-150 ease-in-out"
                        onClick={invite}
                    >
                        Invite Members
                    </button>
                    {joinURL && (
                        <div className="mt-4 p-2 bg-gray-100 rounded">
                            <p>Invite Link:</p>
                            <a href={joinURL} target="_blank" rel="noopener noreferrer" className="break-all text-blue-500 hover:text-blue-700">
                                {joinURL}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

