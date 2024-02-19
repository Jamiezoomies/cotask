import React from 'react';

function UserProfile(uid) {
    let profileData = {};
    
    //Implement some API fetch request for specific user profile data
    //This data should include their profile image link, email, username, and bio
    const getUserProfile = (uid) => {
        //Dummy version
        profileData = {
            "image": 'https://tr.rbxcdn.com/70108dc7da4e002c8e5d2c1dcf0825fb/420/420/Hat/Png',
            "email": 'johndoe@gmail.com',
            "username": 'The_Real_John_Doe',
            "bio": 'Just a guy looking to collab and get yolked! I go to the gym three times a day and do not rest... ever'
        };
    }

    getUserProfile(uid);

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