import SignupForm from "../components/signup-form"
import { redirectAuthorized } from "../utils/actions";
import Navbar from "../components/navbar";

export default async function SignUp() {
  const user = await redirectAuthorized('/home')

  return (
    <>
      <SignupForm/>
      <Navbar/>
    </>
  )
}
  