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
          return <p className="font-bold bg-indigo-100">We can't find the group channel! Check the url or code again.</p>;
        }
      
        // Check if the group is found and joinable (meaning you are not a member yet)
        if (group?.ok && group?.joinable) {
          return (
            <>
              <p className="font-bold bg-indigo-100">We've located the channel, but it looks like you're not a member yet. Join now!</p>
              <JoinGroupButton code={code} />
            </>
          )
        }
      
        // Assuming that if it's not joinable and not ok, you're already a member
        if (group?.ok && !group?.joinable) {
          return (
            <>
              <p className="font-bold bg-indigo-100">You're already a member of this channel.</p>
              <a href={`/group/${code}`} className="bg-gray-800 hover:bg-gray-500 text-white rounded-lg mt-4 p-4 shadow-lg">Return to the channel</a>
            </>
          )
        }
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
              <h1 className="text-4xl my-4 font-bold">Welcome to Our Channel!</h1>
              <div className="bg-white shadow-md rounded-lg pt-12 pb-10 px-8 flex flex-col justify-center items-center space-y-4">
                <h2 className="font-bold text-lg">{group?.data?.name}</h2>
                <p className="text-semibold text-md">{group?.data?.description}</p>
                <p className="text-semibold text-md">Code: {group?.data?.join_url}</p>
              {renderGroupInfo()}
              </div>
            </div> 
        </>
    )
}

// Join button for users to join the group channel
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
      <button className="bg-purple-700 hover:bg-purple-600 text-white rounded-lg mt-4 p-4 shadow-lg" onClick={join}>
          Join Group
      </button>
  )
}

export { InviteMember }