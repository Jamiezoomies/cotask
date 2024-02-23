import { getTasks } from "../lib/actions"

async function TaskList({ channel }) {
    const response = await getTasks(channel)
    console.log(response)
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

export { TaskList }