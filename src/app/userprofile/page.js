import { redirect } from "next/navigation"
import UserProfile from "../components/userprofile"
import { getSession } from "../lib/actions"

export default async function UserProf() {
    const session = await getSession()
    if (session && !session?.ok) {
        redirect("/signin")
    }
    return(
        <>
            <UserProfile />
        </>
    )
}