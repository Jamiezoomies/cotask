'use client'
import { useState, useEffect } from "react"
import { createTask, getTask, editTask, getTasks, deleteTask} from "../lib/actions"
import { Loading, Message } from "./utils"
import { Modal } from "../components/modal"


// TaskBoard contains 3 task lists based on the task's status.
function TaskBoard({channel}) {
    const [isLoading, setLoading] = useState(true)
    const [isEditorOpen, setEditorOpen] = useState(false)
    const [isCreationOpen, setCreationOpen] = useState(false)
    const [selectedTaskId, setSelectedTaskId] = useState()
    const [todoTasks, settodoTasks] = useState([])
    const [inprogressTasks, setinprogressTasks] = useState([])
    const [doneTasks, setdoneTasks] = useState([])
    
    // fetch tasks based on the status
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
            setLoading(false)

        })()
    }, [isCreationOpen, isEditorOpen])

    function selectTask(taskId) {
        setSelectedTaskId(taskId)
        setEditorOpen(true)
    }

    if (isLoading) { return (<Loading/>)}

    return (
        <>
            <Modal isOpen={isEditorOpen} onClose={()=>setEditorOpen(false)} title="Edit Task">
                <TaskEditor channel={ channel } id={ selectedTaskId } onClose={()=>setEditorOpen(false)}/>
            </Modal>
            <Modal isOpen={isCreationOpen} onClose={()=>setCreationOpen(false)} title="New Task">
                <TaskCreation channel={channel}/>
            </Modal>
            <h1 className="font-medium text-2xl py-4 px-1">Board</h1>
            <div className="flex flex-row w-full flex-grow gap-4">
                <TaskList title="TODO" tasks={todoTasks} onSelect={selectTask}/>
                <TaskList title="IN PROGRESS" tasks={inprogressTasks} onSelect={selectTask}/>
                <TaskList title="DONE" tasks={doneTasks} onSelect={selectTask}/>
            </div>
            <div className="flex justify-center py-4">
                <button className="w-full hover:bg-gray-400 border-gray-200 rounded-lg py-1 px-2 text-lg bg-gray-200 shadow-md text-gray-700" onClick={()=>setCreationOpen(true)}>+</button>
            </div>
        </>
    )
}

// Display task list
function TaskList({ title, tasks, onSelect }) {
    return (    
        <div className="bg-gray-200 flex-1 border border-gray-200 border-2 rounded-lg py-4 px-1 text-gray-700">
            <h3 className="text-md text-gray-700 font-semibold mb-4 px-4">{title} ({tasks?.length || 0})</h3>
            <ul className="flex flex-col gap-2">
                {tasks?.map(task => (
                    <li 
                        key={task.id} 
                        className="flex items-center shadow-sm p-4 bg-white hover:bg-gray-100 cursor-pointer border border-gray-200 rounded-lg"
                        onClick={()=>onSelect(task.id)}
                    >
                        <span className={`h-2 w-2 rounded-full mr-2 
                        ${task.status === 'todo' ? "bg-blue-500" 
                        : task.status === 'inprogress' ? "bg-green-500" 
                        : task.status === 'done' ? "bg-red-500" : ""}`}></span>
                        <div className="flex flex-col flex-grow">
                            <span className="text-sm text-gray-400">{task?.due_date? task?.due_date?.slice(0,10): "No Due"}</span>
                            <span className="text-xs text-gray-400">Created at {task.created_at?.slice(0,10)}</span>
                            <span className="text-base font-medium">{task.title}</span>
                            <span className="text-xs font-medium">{task.description}</span>
                        </div>
                        <button 
                            onClick={() => onEditTask(task)}
                            className="ml-auto py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-150 ease-in-out"
                        >
                            Edit
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}


function TaskCreation({ channel }) {
    const [response, setResponse] = useState(null)

    // Fetch request to create a new task
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
    const [isLoading, setLoading] = useState(true)

    // Get the current task data on mount
    useEffect(()=> {
        (async()=>{
            const response = await getTask(channel, id)
            if (response?.ok) {
                setTask(response?.data)
                setTaskStatus(response?.data.status)
                if (response) {
                    setLoading(false)
                }
            }
        })()
    }, [])


    // Request to edit the task data
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
            // After editing, close the modal
            onClose()
        }
    }

    return (
        <>
            <Message isError={!response?.ok} text={response?.msg}/>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                { isLoading ? 
                ( <Loading/> ) : ( 
                <>
                    <div className="flex justify-end">
                        <TaskDeleteButton channel={channel} id={task?.id} onClose={onClose}/>
                    </div>
                    <form action={edit}>
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
                                defaultValue={task?.due_date?.slice(0, 10)}
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
                </> )}
            </div>
        </>
    )
}

// Button to delete the task
function TaskDeleteButton({ channel, id, onClose}) {
    async function handleDelete() {
        const response = await deleteTask(channel, id)
        if (response.ok) {
            // After deletion, close the modal
            onClose()
        }
    } 
    return (
        <button className="text-sm bg-gray-800 shadow-lg hover:bg-gray-500 text-white rounded-lg px-2 py-1"onClick={handleDelete}>Delete Task</button>
    )
}

export { TaskList, TaskCreation, TaskBoard, TaskDeleteButton}
