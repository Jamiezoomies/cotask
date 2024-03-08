'use client'
import { useState, useEffect } from "react"
import { createTask, getTask, editTask, getTasks, deleteTask} from "../lib/actions"
import { Message } from "../components/message"
import { Modal } from "../components/modal"


function TaskBoard({channel}) {
    const [isEditorOpen, setEditorOpen] = useState(false)
    const [isCreationOpen, setCreationOpen] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState()
    const [todoTasks, settodoTasks] = useState([])
    const [inprogressTasks, setinprogressTasks] = useState([])
    const [doneTasks, setdoneTasks] = useState([])
    

    useEffect(() =>{
        (async()=>{
            if (isCreationOpen || isEditorOpen ) {
                return
            }

            const tasks1 = await getTasks(channel, "todo")
            const tasks2 = await getTasks(channel, "inprogress")
            const tasks3 = await getTasks(channel, "done")
            settodoTasks(tasks1?.data)
            setinprogressTasks(tasks2?.data)
            setdoneTasks(tasks3?.data)

        })()
    }, [isCreationOpen, isEditorOpen])

    function selectTask(taskId) {
        setSelectedTaskId(taskId)
        setEditorOpen(true)
    }

    return (
        <>
            <Modal isOpen={isEditorOpen} onClose={()=>setEditorOpen(false)} title="Edit Task">
                <TaskEditor channel={ channel } id={ selectedTaskId } onClose={()=>setEditorOpen(false)}/>
            </Modal>
            <Modal isOpen={isCreationOpen} onClose={()=>setCreationOpen(false)} title="New Task">
                <TaskCreation channel={channel}/>
            </Modal>
            <button onClick={()=>setCreationOpen(true)}>Create</button>
            <div className="flex flex-row">
                <TaskList tasks={todoTasks} onSelect={selectTask}/>
                <TaskList tasks={inprogressTasks} onSelect={selectTask}/>
                <TaskList tasks={doneTasks} onSelect={selectTask}/>
            </div>
        </>
    )
}

function TaskList({ tasks, onSelect }) {

    return (
        <div className="bg-gray-900 text-white">
            <div className="py-4">
                <p className="text-sm">{tasks?.msg}</p>
            </div>
            <ul className="flex flex-col">
                {tasks?.map(task => (
                    <li 
                        key={task.id} 
                        className="flex items-center py-2 hover:bg-gray-700 cursor-pointer"
                        onClick={()=>onSelect(task.id)}
                    >
                        <span className={`h-2 w-2 rounded-full mr-2 
                        ${task.status === 'todo' ? "bg-blue-500" 
                        : task.status === 'inprogress' ? "bg-green-500" 
                        : task.status === 'done' ? "bg-red-500" : ""}`}></span>
                        <div className="flex flex-col flex-grow">
                            <span className="text-sm font-medium">{task.title}</span>
                            <span className="text-xs text-gray-400">{task.due_date}</span>
                            <span className="text-xs text-gray-400">{task.created_at}</span>
                            <span className="text-xs text-gray-400">{task.status}</span>
                            <span className="text-xs text-gray-400">{task.priority}</span>
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

function TaskEditor({ channel, id, onClose}) {
    const [task, setTask] = useState()
    const [response, setResponse] = useState()
    const [taskStatus, setTaskStatus] = useState()

    useEffect(()=> {
        (async()=>{
            const response = await getTask(channel, id)
            if (response?.ok) {
                setTask(response?.data)
                setTaskStatus(response?.data.status)
            }
            
        })()
    }, [])

    async function edit (formData) {
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            dueDate: formData.get('due_date') || null,
            status: taskStatus,
        }

        const edited = await editTask(data, channel, id)
        setResponse(edited);
        if (edited?.ok) {
            onClose()
        }
    }

    return (
        <>
            <Message isError={!response?.ok} text={response?.msg}/>
            <TaskDeleteButton channel={channel} id={task?.id} onClose={onClose}/>
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
                <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Status
                </label>
                <div className="flex space-x-2 mb-3">
                    <button
                    type="button"
                    className={`py-2 px-4 rounded ${taskStatus === 'todo' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setTaskStatus('todo')}
                    >
                    Todo
                    </button>
                    <button
                    type="button"
                    className={`py-2 px-4 rounded ${taskStatus === 'inprogress' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setTaskStatus('inprogress')}
                    >
                    In Progress
                    </button>
                    <button
                    type="button"
                    className={`py-2 px-4 rounded ${taskStatus === 'done' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setTaskStatus('done')}
                    >
                    Done
                    </button>
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due_date">Created By</label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                        id="created_by"
                        type="text" 
                        name="created_by"
                        defaultValue={task?.username}
                        readOnly
                        disabled
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="w-full bg-gray-800 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Edit task
                    </button>
                </div>
            </form>
        </>
    )
}

function TaskDeleteButton({ channel, id, onClose}) {
    async function handleDelete() {
        const response = await deleteTask(channel, id)
        if (response.ok) {
            onClose()
        }
    } 
    return (
        <button className="text-sm bg-purple-900 border border-purple-400 border-purple-400 text-purple-400 rounded-md px-2 py-1"onClick={handleDelete}>Delete</button>
    )
}

export { TaskList, TaskCreation, TaskBoard, TaskDeleteButton}