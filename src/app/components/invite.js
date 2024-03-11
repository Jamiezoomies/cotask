'use client'
import { useEffect } from "react"
import { redirectTo, joinGroup } from "../lib/actions"

function InviteMember({ isSignedIn, group, code }) {

    useEffect(()=> {    
        if (!isSignedIn) {
            redirectTo('/signin')
        }
    }, [])
    
    function renderGroupInfo() {
        // If group is not found, undefined or null
        if (!group || !group?.data) {
          return <p className="mt-2 text-lg">Can't find the group channel! Check the url or code again.</p>;
        }
      
        // Check if the group is found and joinable (meaning you are not a member yet)
        if (group?.ok && group?.joinable) {
          return (
            <>
              <p>Found the channel, you are not a member yet. Join!</p>
              <JoinGroupButton code={code} />
            </>
          )
        }
      
        // Assuming that if it's not joinable and not ok, you're already a member
        if (group?.ok && !group?.joinable) {
          return (
            <>
              <p>You're already a member of this channel.</p>
              <a href={`/group/${code}`}>Return to the channel</a>
            </>
          )
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
              <h1 className="text-4xl font-bold">Welcome to Our Channel!</h1>
              <h2>{group?.data?.name}</h2>
              <p>{group?.data?.description}</p>
              {renderGroupInfo()}
            </div> 
        </>
    )
}

function JoinGroupButton({code}) {
  async function join() {
      const data = {code: code}
      const response = await joinGroup(data)
      console.log(response)
      if(response?.ok) {
        redirectTo(`/group/${code}`)
      }
  }

  return (
      <button className="bg-purple-800 hover:bg-purple-400 text-white rounded-lg mt-4 p-4 shadow-md" onClick={join}>
          Join Group!
      </button>
  )
}

export { InviteMember }