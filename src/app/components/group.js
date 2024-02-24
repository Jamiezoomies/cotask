import { getGroups } from "../lib/actions"

async function GroupList() {
    const response = await getGroups()
    
    return (
        <div className="bg-gray-900 w-64 text-white p-4">
            <div className="py-4">
                <p className="text-sm">{response?.msg}</p>
            </div>
            <ul className="flex flex-col">
                {response?.data?.map(group => (
                    <li 
                        key={group.id} 
                        className="flex items-center py-2 hover:bg-gray-700 cursor-pointer"
                    >
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                        <a href={`/group/${group.join_url}`}>
                            <div className="flex flex-col flex-grow">
                                <span className="text-sm font-medium">{group.name}</span>
                                <span className="text-xs text-gray-400">{group.description}</span>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export { GroupList }