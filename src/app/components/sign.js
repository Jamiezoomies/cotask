'use client'
import { useEffect, useState } from "react"
import { handleSignIn, handleLogout, handleSignUp, redirectTo } from "../lib/actions"
import { Message, Loading } from "./utils"
import { getSession } from "../lib/actions";
import { useSearchParams } from "next/navigation";

function SignupForm() {
    const [response, setResponse] = useState(null)
    const [isLoading, setLoading] = useState(true)

    async function register(formData) {
        setResponse(await handleSignUp(formData))
        const session = await getSession()
        if (session?.ok) {
            redirectTo('/group')
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            { !response?.ok && <Message isError={!response?.ok} text={response?.msg}/> }
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                { response?.ok ? 
                (
                <div className="bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md" role="alert">
                    <div className="flex">
                        <div className="py-1"></div>
                        <div>
                            <p className="font-bold">Successfully Registered!</p>
                            <p className="text-sm">You can now <a href="/signin" className="text-green-600 font-bold hover:text-green-800">sign in</a> to your account.</p>
                        </div>
                    </div>
                </div>
                ):
                (
                <form action={register}>
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
                )}
            </div>
        </div>
    )
    
}

function SigninForm({ session }) {
    const [isLoading, setLoading] = useState(true)
    const [response, setResponse] = useState(null)
    const destination_url = useSearchParams().get('destination_url')

    useEffect(()=>{
        (async()=>{
            if (!session || session?.ok) { 
                if (destination_url){
                    redirectTo('/group/'+destination_url+'/join')
                } else {
                    redirectTo('/group')
                }
            } else {
                setLoading(false)
            }
        })()
    }, [session])

    async function signin(formData) {
        setResponse(await handleSignIn(formData))        
    }

    if (isLoading) { 
        return (<Loading/>) 
    }
    
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <Message isError={!response?.ok} text={response?.msg}/>
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
                <div className="py-2">
                    <p className="text-sm text-blue">Not registered? <a className="text-indigo-900 bg-indigo-200" href="/signup">Sign up</a></p>
                </div>
            </form>
        </div>
    )
}

function LogoutButton() {
    return (
        <button 
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {handleLogout(); redirectTo('/signin')}}>
            Logout
        </button>
    )
}

export {SigninForm, SignupForm, LogoutButton}

