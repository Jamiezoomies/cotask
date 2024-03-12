import React from "react";
import Link from "next/link";
import { getSession } from "../lib/actions"
import { LogoutButton } from "./sign";

async function Navbar() {

    var navBarItems = [ "Sign Up", "/signup", "Sign In", "/signin" ]
    const session = await getSession()
    if (session && session?.ok) {
        navBarItems = [ "Groups", "/group", "Profile", "/profile"]
    }

    return (
        <div className="flex items-center fixed w-screen top-0 self-center mx-0 py-4 px-4 border border-gray-300 bg-gray-100">
            <Link href="/">
                <p className="block text-center text-gray-800 text-md font-bold px-6 text-xl">
                    CoTask
                </p>
            </Link>

            {/*Left Side*/}
            {[
                ['Team', '/team'],
            ].map(([title, url]) => (
                <Link href={url}>
                    <p className="block text-center text-gray-800 hover:text-blue-400 text-md font-bold px-6">{title}</p>
                </Link>
            ))}

            <div className="flex-1 grow-1"> </div>

            {/*Right Side*/}
            {[
                [ navBarItems[0], navBarItems[1]],
                [ navBarItems[2], navBarItems[3]],
            ].map(([title, url]) => (
                <Link href={url}>
                    <p className="block text-center text-gray-800 hover:text-blue-400 text-md font-bold px-6">{title}</p>
                </Link>
            ))}
        </div>
    )
}

export { Navbar };