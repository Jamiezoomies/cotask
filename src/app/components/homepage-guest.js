import React from 'react';
import Link from "next/link";

function HomePageGuests() {
    return(
        <>
            <div className="flex justify-center items-center h-full bg-gray-100">
                <div className="w-full rounded py-48 px-48">
                    <div className="w-1/2 float-left">
                        <h1 className='font-bold text-gray-700 text-6xl pb-16'>Welcome to CoTask</h1>
                        <h1 className='text-gray-500 pb-16 text-3xl'>To begin working collaboratively with your team, sign-in or create an account below!</h1>
                        <Link href="/signin">
                            <button className="bg-gray-600 hover:bg-gray-500 rounded text-white py-4 px-4 text-2xl mr-8 focus:outline-none focus:shadow-outline">Sign-In</button>
                        </Link>
                        <Link href="/signup">
                            <button className="bg-gray-600 hover:bg-gray-500 rounded text-white py-4 px-4 text-2xl mr-8 focus:outline-none focus:shadow-outline">Create Account</button>
                        </Link>
                    </div>
                    
                    
                </div>
            </div>
            <div className="flex justify-center items-center h-full bg-gray-300">
                <div className="w-full rounded pt-48 pb-32 px-48">
                    <div className="w-1/2 float-right">
                        <h1 className='font-bold text-gray-900 text-5xl pb-16'>About CoTask</h1>
                        <h1 className='text-gray-700 pb-16 text-2xl'>
                            CoTask aims to streamline task management, providing users with an easily accesible and user-friendly platform for shareable-task management. 
                            By creating a group and inviting others, users can create and share tasks, make comments on progress, and log updates to foster seamless collaboration.
                        </h1>
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center h-full bg-gray-100">
                <div className="w-full rounded pt-48 pb-24 px-48">
                    <div className="w-1/2 float-left">
                        <h1 className='font-bold text-gray-700 text-5xl pb-16'>The Team</h1>
                        <h1 className='text-gray-500 pb-16 text-2xl'>
                            CoTask was developed by UCLA students as a project for CS35L, a computer science course about the fundamentals of software construction.
                            To see who contributed, check out the team page below.
                        </h1>
                        <Link href="/team">
                            <button className="bg-gray-600 hover:bg-gray-500 rounded text-white py-4 px-4 text-2xl mr-8 focus:outline-none focus:shadow-outline">Team Page</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>

    )
}

export default HomePageGuests;