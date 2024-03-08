import { getSession, getTasks } from "../../../lib/actions"
import { InviteMember } from "../../../components/invite"

export default async function Join({ params }) {
    const session = await getSession()
    const tasks = await getTasks(params.code)
    
    return (
        <>
            <InviteMember isSignedIn={session?.ok} isMember={tasks?.ok} channel={params.code}/>
        </>
    )
    
}