'use client'
import { useState,  } from "react"
import { handleSignIn, handleLogout, handleSignUp } from "../lib/actions"
import { Message } from "../components/message"
function SignupForm() {
    const [isError, setError] = useState(true)
    const [message, setMessage] = useState('')
    
    async function register(formData) {
        const response = await handleSignUp(formData)
        setError(!response.ok)
        setMessage(response.msg)
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <Message isError={isError} text={message}/>
            <form action={register} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">Sign Up</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="email" 
                        type="email" 
                        name="email" 
                        required 
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                        id="password" 
                        type="password" 
                        name="password" 
                        required 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="username" 
                        type="text" 
                        name="username" 
                        required 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
                        First Name
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="firstname" 
                        type="text" 
                        name="firstname" 
                        required 
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
                        Last Name
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="lastname" 
                        type="text" 
                        name="lastname" 
                        required 
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button className="w-full bg-gray-800 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}

function SigninForm() {
    const [isError, setError] = useState(true)
    const [message, setMessage] = useState('')
    
    async function signin(formData) {
        const response = await handleSignIn(formData)
        setError(!response.ok)
        setMessage(response.msg)
    }
        
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <Message isError={isError} text={message}/>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" action={signin}>
                <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">Sign In</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        id="email" 
                        type="email" 
                        name="email" 
                        required 
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                        id="password" 
                        type="password" 
                        name="password" 
                        required 
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button className="w-full bg-gray-800 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    );
}

function LogoutButton() {
    return (
        <button 
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleLogout()}>
            Logout
        </button>
    )
}

export {SigninForm, SignupForm, LogoutButton}

