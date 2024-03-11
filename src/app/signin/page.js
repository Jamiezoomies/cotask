import { SigninForm } from "../components/sign"
import { getSession } from "../lib/actions"
import Navbar from "../components/navbar";

export default async function SignInPage() {
    const session = await getSession()

    return (
        <>
            <SigninForm session={session}/>
            <Navbar/>
        </>
    )
}