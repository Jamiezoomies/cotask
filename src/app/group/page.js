
import { GroupList } from "../components/group"
import { getSession, redirectTo, getGroups } from "../lib/actions"

export default async function GroupPage() {
    const session = await getSession()
    const groups = await getGroups()

    if (!session || !session?.ok) {
        redirectTo('/signin')
        return null
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

