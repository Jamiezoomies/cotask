import { redirect } from "next/navigation";
import { SignupForm } from "../components/sign"
import { getSession } from "../lib/actions";

export default async function SignUp() {
  const session = await getSession()
  if (!session || session?.ok) { 
    redirect('/group')
  }

  return (
    <>
      <SignupForm/>
    </>
  )
}
  