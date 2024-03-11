import { getJoinGroup, getSession } from "../../../lib/actions"
import { InviteMember } from "../../../components/invite"

export default async function Join({ params }) {
    const session = await getSession()
    const group = await getJoinGroup(params.code)

    return (
        <>
            <InviteMember isSignedIn={session?.ok} group={group} code={params.code}/>
        </>
    )
    
}