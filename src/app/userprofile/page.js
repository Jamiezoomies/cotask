import { redirect } from "next/navigation"
import UserProfile from "../components/userprofile"
import { getSession } from "../lib/actions"

export const metadata = {
    title: "Profile",
    description: "Profile page"
};
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