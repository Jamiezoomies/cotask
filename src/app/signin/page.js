import { SigninForm } from "../components/sign"
import { getSession } from "../lib/actions"

export default async function SignInPage() {
    // retrieve a session
    const session = await getSession()

    return (
        <>
            <SigninForm session={session}/>
        </>
    )
}