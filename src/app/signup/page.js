import { SignupForm } from "../components/sign"
import { getSession, redirectTo } from "../lib/actions";

export default async function SignUp() {
  
  const session = await getSession()
  if (!session || session?.ok) { return null }

  return (
    <>
      <SignupForm />
    </>
  )
}
  