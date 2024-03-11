import UserProfile from "../components/userprofile"
import Navbar from "../components/navbar";
import React from "react";

export default function UserProf() {
    return(
        <>
            <div className="fixed w-full">
                <UserProfile uid="1234" />
            </div>
            <Navbar/>
        </>
    )
}