import { GroupDetailsModal, GroupList } from "../../components/group"
import { TaskBoard } from "../../components/task"
import { redirectTo, getSession, getTasks, getGroups, getGroup} from "../../lib/actions"

export default async function SpecificGroupPage({ params }) {
    const session = await getSession()
    const groups = await getGroups(params.code)
    const group = await getGroup(params.code)
    
    if (session && !session?.ok){
        redirectTo('/signin')
    }

    if (!session || !session?.ok) {
        return null
    }

    return (
        <>
            <div className="min-h-screen flex">
                <GroupList groups={groups?.data}/>
                <div className="flex flex-col p-4">
                    <p>{ params.code }</p>
                    <GroupDetailsModal group={group?.data} />
                    <TaskBoard channel={params.code}/>
                </div>
            </div>
        </>
    )
}