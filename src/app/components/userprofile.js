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
        <div className="rounded-md mx-10 my-10 bg-gray-100 p-3">
            <h2 className="text-2x1 font-bold text-gray-700 p-3 shrink">{profileData.username}</h2>
            <div className="h-24 w-24 overflow-hidden rounded-full">
                <img className="h-full w-full object-cover" src={profileData.image}></img>
            </div>
            <p className="block text-gray-700 text-sm font-bold p-3 shrink">{profileData.email}</p>
            <p className="block text-gray-700 text-sm font-bold break-words p-3 shrink">{profileData.bio}</p>
        </div>
    );
}

export default UserProfile;