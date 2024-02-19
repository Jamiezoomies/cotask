'use client'

import { useState } from 'react';
import { handleSignIn } from "@/app/utils/actions"

function SigninForm() {
    const SIGNIN_API_URL = '/api/signin-user'
    const [message, setMessage] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const handleChange = (e) => {
       setFormData({
           ...formData,
           [e.target.name]: e.target.value
        });
    };
    
    function handleSubmit () {
        fetch(SIGNIN_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application.json'},
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                setMessage("The user has been successfully signed in.")
                return response.json()
            } else {
                setMessage("The user sign-in has been failed.")
                throw new Error()
            }
        })
        .then(data => {
            handleSignIn(data)
        })
        .catch(error => {
            setMessage("An error occurred: " + error)
        })
    }
        
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" action={handleSubmit}>
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
                        value={formData.email} 
                        onChange={handleChange} 
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
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button className="w-full bg-gray-800 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Sign In
                    </button>
                </div>
                <div>
                    <p className="min-w-md">
                        {message}
                    </p>
                </div>
            </form>
        </div>
    );
}

export default SigninForm;