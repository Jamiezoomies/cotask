import { SigninForm } from "../components/sign"
import { getSession } from "../lib/actions";

export default async function SignInPage() {
    const session = await getSession()
    if (!session || session?.ok) { return null }

    return (
        <>
            <SigninForm/>
        </>
    )
}