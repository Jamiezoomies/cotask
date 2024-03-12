
import { redirect } from "next/navigation"
import { GroupList } from "../components/group"
import { getSession, getGroups } from "../lib/actions"

export default async function GroupPage() {
    const session = await getSession()
    const groups = await getGroups()
    console.log(session)

    if (!session || !session?.ok) {
        redirect('/signin')
    }

    return (
        <>
            <div className="min-h-screen flex pt-16">
                <GroupList groups={groups?.data}/>
                <div className=" w-full flex flex-col p-4 items-center justify-center text-semibold space-y-4 text-lg">
                    <p>This is an amazing task management app, <span className="font-bold">CoTask!</span></p>
                    <p>Welcome, <span className="font-bold">{session?.session.username}.</span></p>
                    <div>
                        <p className="bg-indigo-100">
                        Create a group channel or become part of an incredible group to work seamlessly with your teammates.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

