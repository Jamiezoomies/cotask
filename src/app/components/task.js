'use client'
import { useState, useEffect } from "react"
import { getTasks, createTask } from "../lib/actions"
import { Message } from "../components/message"

function TaskList({ channel }) {
    const [response, setResponse] = useState(null)
    
    useEffect(() => {
        (async () => {
            setResponse(await getTasks(channel))
        })()

    }, [])

    return (
        <div className="bg-gray-900 text-white">
            <div className="py-4">
                <p className="text-sm">{response?.msg}</p>
            </div>
            <ul className="flex flex-col">
                {response?.data?.map(task => (
                    <li 
                        key={task.id} 
                        className="flex items-center py-2 hover:bg-gray-700 cursor-pointer"
                    >
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        <div className="flex flex-col flex-grow">
                            <span className="text-sm font-medium">{task.name}</span>
                            <span className="text-xs text-gray-400">{task.description}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function CreateTask({ channel }) {
    const [response, setResponse] = useState(null)

    function create (formData) {
        console.log(channel)
        setResponse(createTask(channel, formData))
    }

    return (
        <div>
            <Message isError={!response?.ok} text={response?.msg}/>
            <form action={create} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">Add a task</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Task Title
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id='title'
                        type="text"
                        name="title"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Task Description</label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                        id="description"
                        name="description"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due_date">Due Date</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                        id="due_date"
                        type="date" 
                        name="due_date"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="w-full bg-gray-800 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Create a task
                    </button>
                </div>
            </form>
        </div>
    )
}

export { TaskList, CreateTask }