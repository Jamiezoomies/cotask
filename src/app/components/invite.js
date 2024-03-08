'use client'
import { useEffect } from "react"
import { redirectTo } from "../lib/actions"

function InviteMember({ isSignedIn, isMember, channel }) {
    useEffect(()=> {    
        if (!isSignedIn) {
            redirectTo('/signin')
        }
    }, [])
        
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold">Welcome to Our Channel!</h1>
            { !isMember ? (
            <>
                <p className="mt-2 text-lg">If you're not a member yet, join us to start collaborating.</p>
                <JoinGroupButton code={channel} />
            </>
            ):(
                <p>You're already a member</p>)
            }
            
            </div> 
        </>
    )
}

function JoinGroupButton(code) {
    
    async function join() {
        const response = await joinGroup(code)
    }

    return (
        <button className="bg-purple-400 hover:bg-purple-600 text-white rounded p-4 shadow-md" onClick={join}>
            Join Group
        </button>
    )
}

export { InviteMember }