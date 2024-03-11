import { getGroup, getSession } from "../../../lib/actions"
import { InviteMember } from "../../../components/invite"
import Navbar from "../../../components/navbar";

export default async function Join({ params }) {
    const session = await getSession()
    const group = await getGroup(params.code)
    console.log(group)
    return (
        <>

            <div className="absolute w-full">
                <InviteMember isSignedIn={session?.ok} group={group} code={params.code}/>
            </div>
            <Navbar/>
        </>
    )
    
}