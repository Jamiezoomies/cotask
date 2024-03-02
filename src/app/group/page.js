
import { GroupList } from "../components/group"
import { getSession, redirectTo } from "../lib/actions"

export default async function GroupPage() {
    const session = await getSession()

    if (!session || !session?.ok) {
        redirectTo('/signin')
        return null
    }

    return (
        <>
            <div className="min-h-screen flex">
                <GroupList/>
                <div className="flex flex-col p-4">
                </div>
            </div>
        </>
    )
}

