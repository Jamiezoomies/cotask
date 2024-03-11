
import { redirect } from "next/navigation"
import { GroupList } from "../components/group"
import { getSession, getGroups } from "../lib/actions"

export default async function GroupPage() {
    const session = await getSession()
    const groups = await getGroups()

    if (!session || !session?.ok) {
        redirect('/signin')
    }

    return (
        <>
            <div className="min-h-screen flex">
                <GroupList groups={groups?.data}/>
                <div className="flex flex-col p-4">
                </div>
            </div>
        </>
    )
}

