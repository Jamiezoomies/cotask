import SigninForm from "../components/signin-form"
import { redirectAuthorized } from "../utils/actions";
import Navbar from "../components/navbar";

export default async function SignIn() {
    const user = await redirectAuthorized('/home')

    return (
        <>
            <SigninForm/>
            <Navbar/>
        </>
    )
}