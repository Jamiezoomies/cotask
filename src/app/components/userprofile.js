'use client';
import React, { useEffect, useState } from 'react';
import { getUserProfile } from "../lib/actions"
import { Loading } from './utils';

function UserProfile() {
    const [profileData, setProfileData] = useState({username: '', email: '', image: '', bio: ''});
    const [isLoading, setisLoading] = useState(true);

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
    if(isLoading){
        return (<Loading/>)
    }
    
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="bg-white max-w-80 shadow-md rounded px-4 pt-10 pb-6 mb-4 space-y-6">
                <div className="w-32 h-32 mb-4 mx-auto overflow-hidden rounded-full bg-gray-300">
                    <img className="h-full w-full object-cover" src={profileData.image}/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                    <hr></hr>
                    <h2 className="text-xl text-center font-bold text-gray-700 pt-3">
                        {profileData.username}
                    </h2>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <hr></hr>
                    <p className="block text-center text-gray-400 text-md font-bold pt-3">
                        {profileData.email}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Biography</label>
                    <hr></hr>
                    <p className="block text-gray-500 text-md font-bold break-words p-3">
                        {profileData.bio}
                    </p>
                </div>
            </div>
            <div className="block text-gray-800 bg-indigo-200 text-sm break-words p-1 hover:text-gray-500">
                <a href="/editprofile">Edit profile and Change Email & Password</a>
            </div>
        </div>
    );
}

export default UserProfile;