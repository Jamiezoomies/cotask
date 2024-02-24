
import { GroupList } from "../../components/group"
import { TaskList, CreateTask} from "../../components/task"

export default function GroupPage({ params }) {
    
    return (
        <>
            <div className="min-h-screen flex">
                <GroupList/>
                <div className="flex flex-col p-4">
                    <p>{ params.code }</p>
                    <TaskList channel={params.code}/>
                    <CreateTask channel={params.code}/>
                </div>
            </div>
        </>
    )
}

