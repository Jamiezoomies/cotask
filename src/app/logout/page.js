'use client'
import {LogoutButton} from "../components/sign"
import Navbar from "../components/navbar";

export default async function Logout() {
    return (
        <>
            <Navbar/>
            <LogoutButton/>
        </>
    )
}