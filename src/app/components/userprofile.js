'use client';
import React, { useEffect, useState } from 'react';
import { getUserProfile } from "../lib/actions"

function UserProfile() {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getUserProfile(); 
            if (result.ok) {
                setProfileData(result.data);
            } else {
                console.error(result.msg);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white max-w-sm shadow-md rounded px-4 pt-10 pb-6 mb-4">
                <div className="w-1/2 mx-auto overflow-hidden rounded-full">
                    <img className="h-full w-full object-cover" src={profileData.image}/>
                </div>
            <h2 className="text-xl text-center font-bold text-gray-700 pt-3">
                {profileData.username}
            </h2>
            <p className="block text-center text-gray-400 text-md font-bold pb-3">
                {profileData.email}
            </p>
            <hr></hr>
            <p className="block text-gray-500 text-md font-bold break-words p-3">
                {profileData.bio}
            </p>
            </div>
        </div>
    );
}

export default UserProfile;