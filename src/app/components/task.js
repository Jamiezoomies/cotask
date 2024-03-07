'use client'
import { useState, useEffect } from "react"
import { getTasks, createTask, getTask } from "../lib/actions"
import { Message } from "../components/message"
import { Modal, ToggleModalButton } from "../components/modal"


function TaskList({ channel, tasks }) {
    const [isEditorOpen, setEditorOpen] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState()
    const [completedTasks, setCompletedTasks] = useState({}); // Initalize the completion status of all tasks to be empty (false)
    
    // set the selected task to be the inverse upon clicking "complete"
    const toggleCompletedTasks = (taskId) => {
        setCompletedTasks((prevTasks) => ({
            ...prevTasks,
            [taskId] : !prevTasks[taskId]
        }));
    };
    return (
        <div className="bg-gray-900 text-white">
            <Modal isOpen={isEditorOpen} onClose={()=>setEditorOpen(false)} title={"Edit Task"}>
                <TaskEditor channel={ channel } id={ selectedTaskId }/>
            </Modal>
            <div className="py-4">
                <p className="text-sm">{tasks?.msg}</p>
            </div>
            <ul className="flex flex-col">
                {tasks?.map(task => (
                    <li 
                        key={task.id} 
                        className={`flex items-center py-2 cursor-pointer ${completedTasks[task.id] ? 'bg-gray-500' : 'hover:bg-green-700'}`}
                        onClick={()=>{ setSelectedTaskId(task.id); setEditorOpen(true) }}
                    >
                        <button onClick={() => toggleCompletedTasks(task.id)} className="text-xs font-semibold mr-2 p-1 bg-blue-500 hover:bg-blue-700 rounded">
                            {completedTasks[task.id] ? 'Complete' : 'Completed'}
                        </button>
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        <div className="flex flex-col flex-grow">
                            <span className={`text-sm font-medium ${completedTasks[task.id] ? 'line-through' : ''}`}>{task.title}</span>
                            <span className="text-xs text-gray-400">{task.description}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function TaskCreation({ channel }) {
    const [response, setResponse] = useState(null)

    async function create (formData) {
        setResponse(await createTask(channel, formData))
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

function TaskCreationModal({ channel }) {
    const [isModalOpen, setModalOpen] = useState(false)

    function toggleModal () {
        setModalOpen(!isModalOpen)
    }

    return (
        <>
            <ToggleModalButton label="Create a task" onClick={toggleModal} />
            <Modal isOpen={isModalOpen} onClose={toggleModal} title="Create a task">
                <TaskCreation channel={channel}/>
            </Modal>
        </>
    )
}

function TaskEditor({ channel, id }) {
    const [task, setTask] = useState()
    const [response, setResponse] = useState();
    
    useEffect(()=> {
        (async()=>{
            const response = await getTask(channel, id)
            if (response?.ok) {
                console.log(response?.data)
                setTask(response?.data)
            }
        })()
    }, [])

    async function edit (formData, channel, id) {
        const response = await editTask(formData, channel, id)
        setResponse(response);
    }

    return (
        <form action={edit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">Edit a task</h2>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Task Title
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id='title'
                    type="text"
                    name="title"
                    defaultValue={task?.title}
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Task Description</label>
                <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                    id="description"
                    name="description"
                    defaultValue={task?.description}
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
                    defaultValue={task?.due_date}
                />
            </div>
            <div className="flex items-center justify-between">
                <button type="submit" className="w-full bg-gray-800 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Edit task
                </button>
            </div>
        </form>
    )
}

export { TaskList, TaskCreation, TaskCreationModal}