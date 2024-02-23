'use client'
import { useEffect, useState } from "react"
import { createGroup, protectFromUnauthorized } from "../../lib/actions"

export default function GroupCreationPage() {
    const [message, setMessage] = useState('')
    const [session, setSession] = useState(null)

    useEffect(() => {
        (async () => {
            setSession(await protectFromUnauthorized())
        })()

    }, [])
    
    async function create (formData) {
        const group = await createGroup(formData)
        console.log(group)
        if(group) {
            setMessage(`The group created: ${group?.data?.name} - ${group?.data?.join_url}`)
        } else {
            setMessage("An error occurred")
        }
    }

    if (!session) {
        return null
    }

    return (
        <>
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <form action={create} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">Create a Group Channel</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Group Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            name="name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Group Description</label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                            name="description"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="w-full bg-gray-800 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Create Group
                        </button>
                    </div>
                    <div>
                        <p className="min-w-md">
                            {message}
                        </p>
                    </div>
                </form>
            </div>
        </>
    )
}