import { SigninForm } from "../components/sign"
import { getSession } from "../lib/actions"

export const metadata = {
    title: "Signin",
    description: "Signin page"
  };

export default async function SignInPage() {
    // retrieve a session
    const session = await getSession()

    return (
        <>
            <SigninForm session={session}/>
        </>
    )
}