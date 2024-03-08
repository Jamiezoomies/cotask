'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {getUserProfile, updateUserProfile, updateUserAuthenticators} from "../lib/actions"
import {Message} from "./message";

function EditProfile() {
    const [profileData, setProfileData] = useState({username: '', email: '', image: '', bio: ''});
    const [isLoading, setisLoading] = useState(true);
    const [isError, setError] = useState(true)
    const [message, setMessage] = useState('')

    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const result = await getUserProfile(); 
            if (result.ok) {
                setProfileData(result.data);
            } else {
                console.error(result.msg);
            }
            setisLoading(false);
        };

        fetchData();
    }, []);

    function previewProfilePicture(fileSubmit) {
        const img = document.querySelector("img");
        const file = document.getElementById("profile_img").files[0];
        const reader = new FileReader();

        reader.addEventListener(
          "load", () => {
                img.src = reader.result;
            },
            false
        );
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    async function saveChanges(formData) {
        const reader = new FileReader()

        reader.addEventListener(
            "load", async () => {
                formData.append('image_base64', reader.result.replace("data:image/png;base64,", ""));
                const response = await updateUserProfile(formData)
                setError(!response.ok)
                setMessage(response.msg)
            },
            false
        );

        if (formData.get('profile_img')) {
            reader.readAsDataURL(formData.get('profile_img'));
        }
    }

    if(isLoading){
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <Message isError={isError} text={message}/>
            <form className="bg-white max-w-sm shadow-md rounded px-4 pt-10 pb-6 mb-4" action={saveChanges}>
                <div className="relative w-1/2 mx-auto overflow-hidden rounded-full bg-black">
                    <label for="profile_img">
                        <img className="peer h-full w-full object-cover hover:opacity-50" src={profileData.image}/>
                        <p className="absolute pointer-events-none invisible peer-hover:visible block w-full top-1/2 object-cover text-center text-gray-400 text-md px-3">Upload Photo</p>
                    </label>
                    <input className="absolute hidden"
                       id="profile_img"
                       type="file"
                       accept="image/*"
                       height="420"
                       width="420"
                       name="profile_img"
                       onChange={() => previewProfilePicture(this)}
                    />
                </div>
                <input className="shadow appearance-none border rounded w-full text-xl text-center font-bold text-gray-700 pt-3 focus:outline-none focus:shadow-outline"
                    id="username"
                    type="text"
                    name="username"
                    defaultValue={profileData.username}
                    required
                />
                <p className="block text-center text-gray-400 text-md font-bold pb-3">
                    {profileData.email}
                </p>
                <hr></hr>
                <textarea className="resize-none overflow-hidden text-clip shadow appearance-none border rounded w-full p-3 block text-gray-500 text-md font-bold break-words focus:outline-none focus:shadow-outline"
                    id="bio"
                    name="bio"
                    defaultValue={profileData.bio}
                    rows={2}
                />
                <div className="flex flex-row items-center gap-1 pt-3">
                    <button className="w-full bg-gray-800 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Save
                    </button>
                    <button className="w-full bg-gray-800 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={() => router.push('/userprofile')}>
                        Cancel
                    </button>
                </div>
                <div className="flex place-content-center pt-3">
                    <Link href="/edit-email-password">
                        <p className="block text-center text-gray-400 hover:text-blue-400 text-md px-3">Change Email and Password</p>
                    </Link>
                </div>

            </form>
        </div>
    );
}

// function EditEmailPassword() {
//     const [isError, setError] = useState(true)
//     const [message, setMessage] = useState('')
//     async function saveChanges(formData) {
//         const response = await updateUserAuthenticators(formData)
//         setError(!response.ok)
//         setMessage(response.msg)
//     }
//
//     return (
//         <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
//             <Message isError={isError} text={message}/>
//             <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" action={saveChanges}>
//                 {/*<h2 className="text-center text-2xl font-bold text-gray-700 mb-6">Sign In</h2>*/}
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//                         Old Email
//                     </label>
//                     <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                         id="email"
//                         type="email"
//                         name="email"
//                         required
//                     />
//                 </div>
//                 <div className="mb-6">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//                         Old Password
//                     </label>
//                     <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
//                         id="password"
//                         type="password"
//                         name="password"
//                         required
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//                         New Email
//                     </label>
//                     <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                            id="new_email"
//                            type="email"
//                            name="new_email"
//                            required
//                     />
//                 </div>
//                 <div className="mb-6">
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//                         New Password
//                     </label>
//                     <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
//                            id="new_password"
//                            type="password"
//                            name="new_password"
//                            required
//                     />
//                 </div>
//                 <div className="flex items-center justify-between">
//                     <button className="w-full bg-gray-800 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
//                         Submit
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }

export {EditProfile/*, EditEmailPassword*/}