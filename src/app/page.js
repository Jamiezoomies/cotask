import React from 'react';
import Link from "next/link";
import { getSession } from "./lib/actions"
import { redirect } from "next/navigation"


export default async function HomePage() {

  const session = await getSession()

  if (session && session?.ok) {
      redirect('/group')
  }

  return(
      <>
          <div className="flex justify-center items-center bg-gray-100">
              <div className="w-full rounded py-48 px-48">
                  <div className="w-1/2 min-w-[600px] float-left flex-shrink-0">
                      <h1 className='font-bold text-gray-800 text-6xl pb-16'>Welcome to CoTask</h1>
                      <h1 className='text-gray-600 pb-16 text-3xl'>To begin working collaboratively with your team, sign-in or create an account below!</h1>
                      <Link href="/signin">
                          <button className="bg-gray-800 hover:bg-gray-600 rounded text-white py-4 px-4 text-2xl mr-8 focus:outline-none focus:shadow-outline">Sign-In</button>
                      </Link>
                      <Link href="/signup">
                          <button className="bg-gray-800 hover:bg-gray-600 rounded text-white py-4 px-4 text-2xl mr-8 focus:outline-none focus:shadow-outline">Create Account</button>
                      </Link>
                  </div>


              </div>
          </div>
          <div className="flex justify-center items-center bg-gray-800">
              <div className="w-full rounded pt-48 pb-32 px-48">
                  <div className="w-1/2 min-w-[600px] float-right">
                      <h1 className='font-bold text-gray-100 text-5xl pb-16'>About CoTask</h1>
                      <h1 className='text-gray-200 pb-16 text-2xl'>
                          CoTask aims to streamline task management, providing users with an easily accesible and user-friendly platform for shareable-task management. 
                          By creating a group and inviting others, users can create and share tasks, make comments on progress, and log updates to foster seamless collaboration.
                      </h1>
                  </div>
              </div>
          </div>
          <div className="flex justify-center items-center bg-gray-100">
              <div className="w-full rounded pt-48 pb-24 px-48">
                  <div className="w-1/2 min-w-[600px] float-left">
                      <h1 className='font-bold text-gray-800 text-5xl pb-16'>The Team</h1>
                      <h1 className='text-gray-600 pb-16 text-2xl'>
                          CoTask was developed by UCLA students as a project for CS35L, a computer science course about the fundamentals of software construction.
                          To see who contributed, check out the team page below.
                      </h1>
                      <Link href="/team">
                          <button className="bg-gray-800 hover:bg-gray-600 rounded text-white py-4 px-4 text-2xl mr-8 focus:outline-none focus:shadow-outline">Team Page</button>
                      </Link>
                  </div>
              </div>
          </div>
      </>
  );
}