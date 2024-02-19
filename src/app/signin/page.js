import SigninForm from "../components/signin-form"
import { redirectAuthorized } from "../utils/actions";

export default async function SignIn() {
    const user = await redirectAuthorized('/home')

    return (
        <>
            <SigninForm/>
        </>
    )
}