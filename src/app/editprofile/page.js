import { redirect } from "next/navigation"
import {EditProfile} from "../components/editprofile"
import { getSession } from "../lib/actions"

export const metadata = {
    title: "Edit profile",
    description: "Profile editing page"
  };

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