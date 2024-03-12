import { redirect } from "next/navigation"
import {EditProfile} from "../components/editprofile"
import { getSession } from "../lib/actions"

export default async function EditProfilePage() {
    const session = await getSession()
    if (session && !session?.ok) {
        redirect("/signin")
    }
    
    return (
        <>
            <EditProfile/>
        </>
    )
}