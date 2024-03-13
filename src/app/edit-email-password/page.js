import { redirect } from "next/navigation"
import {EditEmailPassword} from "../components/editprofile"
import { getSession } from "../lib/actions"

export const metadata = {
    title: "Edit login",
    description: "Email and password change page"
  };

export default async function SignUp() {
    const session = await getSession()
    if (session && !session?.ok) {
        redirect("/signin")
    }
    return (
        <>
            {<EditEmailPassword/>}
        </>
    )
}