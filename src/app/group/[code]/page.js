import { redirect } from "next/navigation"
import { GroupDetailsModal, GroupList } from "../../components/group"
import { TaskBoard } from "../../components/task"
import { getSession, getGroups, getGroup} from "../../lib/actions"

export default async function SpecificGroupPage({ params }) {
    const session = await getSession()
    const groups = await getGroups(params.code)
    const group = await getGroup(params.code)
    
    if (session && !session?.ok){
        redirect(`/signin?destination_url=${params.code}`)
    }

    return (
        <>
            <div className="min-h-screen flex">
                <GroupList groups={groups?.data}/>
                <div className="flex flex-col p-4">
                    <p>{ params.code }</p>
                    <GroupDetailsModal pageUrl={process.env.BASE_URL} group={group?.data} />
                    <TaskBoard channel={params.code}/>
                </div>
            </div>
        </>
    )
}