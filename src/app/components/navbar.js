import React from "react";
import Link from "next/link";

function Navbar() {
  
    return (
        //"flex items-center sticky top-0 self-center mx-0 py-6 bg-transparent backdrop-blur rounded-b border border-black"
        <div className="flex items-center fixed w-screen top-0 self-center mx-0 py-6 px-4 rounded-b border border-gray-500 bg-gray-100">
            <Link href="/">
                <p className="block text-center text-gray-800 text-md font-bold px-6">
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
                [ "Groups", "/group" ],
                [ "Profile", "/profile"],
                [ "Sign In", "/signin"],
                [ "Sign Up", "/signup"],
            ].map(([title, url]) => (
                <Link href={url}>
                    <p className="block text-center text-gray-800 hover:text-blue-400 text-md font-bold px-6">{title}</p>
                </Link>
            ))}
        </div>
    )
}

export { Navbar };