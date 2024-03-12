import { redirect } from "next/navigation";
import { SignupForm } from "../components/sign"
import { getSession } from "../lib/actions";

export default async function SignUp() {
  // retrieve a session
  const session = await getSession()
  
  // if the user is logged in, redirect to the target page.
  if (!session || session?.ok) { 
    redirect('/group')
  }

  return (
    <>
      <SignupForm />
    </>
  )
}
  