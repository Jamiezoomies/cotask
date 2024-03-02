'use client'
import { useState, useEffect } from "react"
import { createGroup, getSession, redirectTo } from "../../lib/actions"
import { Message } from "../../components/message"
export default function GroupCreationPage() {
    const [session, setSession] = useState(null)
    const [response, setResponse] = useState(null)
    useEffect(() => {
        (async () => {
            const response = await getSession()
            console.log(response)
            setSession(response)
        })()
    }, [])
    
    
    async function create (formData) {
        setResponse(await createGroup(formData))
        if (response.ok) {
            redirectTo('/group/'+response?.data?.join_url)
        }
    }

    if (!session || !session?.ok) { return null }

    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
                <Message isError={!response?.ok} text={response?.msg}/>
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
                </form>
            </div>
        </>
    )
}