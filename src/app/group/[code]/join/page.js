import { getJoinGroup, getSession } from "../../../lib/actions"
import { InviteMember } from "../../../components/invite"

export default async function Join({ params }) {
    // retrieve session and group on mount from server side.
    const session = await getSession()
    const group = await getJoinGroup(params.code)

    return (
        <>
            <InviteMember isSignedIn={session?.ok} group={group} code={params.code}/>
        </>
    )
    
}