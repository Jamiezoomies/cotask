import SignupForm from "../components/signup-form"
import { redirectAuthorized } from "../utils/actions";

export default async function SignUp() {
  const user = await redirectAuthorized('/home')

  return (
    <>
      <SignupForm/>
    </>
  )
}
  