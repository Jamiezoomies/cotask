import React from "react";
import Link from "next/link";

function Navbar() {
    return (
        //"flex items-center sticky top-0 self-center mx-0 py-6 bg-transparent backdrop-blur rounded-b border border-black"
        <div className="flex items-center fixed w-screen top-0 self-center mx-0 py-6 bg-transparent backdrop-blur rounded-b border border-black">
            <Link href="/home">
                <p className="block text-center text-gray-400 text-md font-bold px-3">
                    CoTask
                </p>
            </Link>

            {/*Left Side*/}
            {[
                ['Team', '/team'],
            ].map(([title, url]) => (
                <Link href={url}>
                    <p className="block text-center text-gray-400 hover:text-blue-400 text-md font-bold px-3">{title}</p>
                </Link>
            ))}

            <div className="flex-1 grow-1"> </div>

            {/*Right Side*/}
            {[
                ['Profile', '/userprofile'],
                ['Sign Up', '/signup'],
                ['Sign In', '/signin'],
            ].map(([title, url]) => (
                <Link href={url}>
                    <p className="block text-center text-gray-400 hover:text-blue-400 text-md font-bold px-3">{title}</p>
                </Link>
            ))}
        </div>
    )
}

export default Navbar;