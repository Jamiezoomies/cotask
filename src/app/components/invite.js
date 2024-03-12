'use client'
import { useEffect, useState } from "react"
import { redirectTo, joinGroup } from "../lib/actions"
import { Loading } from "./utils"

function InviteMember({ isSignedIn, group, code }) {
    const [loading, setLoading] = useState(true)

    useEffect(()=> {    
        if (!isSignedIn) {
            redirectTo('/signin')
        } else {
          setLoading(false)
        }
    }, [])
    
    function renderGroupInfo() {
        // If group is not found, undefined or null
        if (!group || !group?.data) {
          return (
            <>
              <h1 className="text-4xl my-4 font-bold">Oops! Channel Not Found!</h1>
              <div className="bg-white shadow-md rounded-lg pt-12 pb-10 px-8 flex flex-col justify-center items-center space-y-4">
                <p className="font-bold bg-indigo-100">We can't find the group channel! Check the url or code again.</p>
                <a href={`/group`} className="bg-gray-800 hover:bg-gray-500 text-white rounded-lg mt-4 p-4 shadow-lg">Return</a>
              </div>
            </>
          )
        }
      
        // Check if the group is found and joinable (meaning you are not a member yet)
        if (group?.ok && group?.joinable) {
          return (
            <>
              <h1 className="text-4xl my-4 font-bold">Welcome to Our Channel!</h1>
              <div className="bg-white shadow-md rounded-lg pt-12 pb-10 px-8 flex flex-col justify-center items-center space-y-4">
                <h2 className="font-bold text-lg">{group?.data?.name}</h2>
                <p className="text-semibold text-md">{group?.data?.description}</p>
                <p className="text-semibold text-md">Code: {group?.data?.join_url}</p>
                <p className="font-bold bg-indigo-100">We've located the channel! It looks like you're not a member yet. Join now!</p>
                <JoinGroupButton code={code} />
              </div>
            </>
          )
        }
      
        // Assuming that if it's not joinable and not ok, you're already a member
        if (group?.ok && !group?.joinable) {
          return (
            <>
              <h1 className="text-4xl my-4 font-bold">Welcome to Our Channel!</h1>
              <div className="bg-white shadow-md rounded-lg pt-12 pb-10 px-8 flex flex-col justify-center items-center space-y-4">
                <h2 className="font-bold text-lg">{group?.data?.name}</h2>
                <p className="text-semibold text-md">{group?.data?.description}</p>
                <p className="text-semibold text-md">Code: {group?.data?.join_url}</p>
                <p className="font-bold bg-indigo-100">You're already a member of this channel.</p>
                <a href={`/group/${code}`} className="bg-gray-800 hover:bg-gray-500 text-white rounded-lg mt-4 p-4 shadow-lg">Return to the channel</a>
              </div>
            </>
          )
        }
    }

    if (loading) { return <Loading/> }

    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
              {renderGroupInfo()}
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

function LinkToJoin() {
  const [groupCode, setGroupCode] = useState('')

  function join () {
    // Assuming the groupCode is a part of the URL you want to navigate to
    const url = `/group/${groupCode}/join`;
    // Redirect to the URL
    window.location.href = url;
  }

  return(
    <>
      <div className="flex flex-row items-center max-w-80">
        <input
            type="text"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            className="text-black rounded p-2 shadow-md flex-1"
            placeholder="Enter group code"
        />
        <button
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded shadow transition-colors duration-150"
            onClick={join}
        >
            Join
        </button>
      </div>
    </>
    
  )
}

export { InviteMember, LinkToJoin }