import { redirect } from "next/navigation"
import { GroupDetailsModal, GroupList } from "../../components/group"
import { TaskBoard } from "../../components/task"
import { getSession, getGroups, getGroup} from "../../lib/actions"
import Navbar from "../../components/navbar";

export default async function SpecificGroupPage({ params }) {
    const session = await getSession()
    const groups = await getGroups(params.code)
    const group = await getGroup(params.code)
    
    if (session && !session?.ok){
        redirect(`/signin?destination_url=${params.code}`)
    }

    return (
        <>
            <Navbar/>
            <div className="min-h-screen flex">
                <GroupList groups={groups?.data}/>
                <div className="flex flex-col w-full p-4">
                    <div className="flex flex-col p-4 bg-white rounded-lg shadow-md border border-black">
                        <h3 className="text-xl font-semibold text-gray-800">{group?.data.name}</h3>
                        <p className="text-gray-600 mt-2">{group?.data.description}</p>
                        <p className="text-sm text-gray-500 mt-4">Code: <span className="font-medium text-gray-700">{params.code}</span></p>
                        <GroupDetailsModal pageUrl={process.env.BASE_URL} group={group?.data} />
                    </div>
                    <div className="flex flex-col">
                        <TaskBoard channel={params.code}/>
                    </div>
                </div>
            </div>
        </>
    )
}