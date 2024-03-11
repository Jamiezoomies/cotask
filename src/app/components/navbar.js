import React from "react";
import Link from "next/link";
import {getSession} from "../lib/actions";

async function Navbar() {
    const session = await getSession();

    let menu = (!session || !session?.ok) ? [
        ['Sign In', '/signin'],
    ] : [
        ['My Groups', '/group'],
        ['Profile', '/userprofile'],
        ['Logout', '/logout'],
    ];

    return (
        //"flex items-center sticky top-0 self-center mx-0 py-6 bg-transparent backdrop-blur rounded-b border border-black"
        <div className="flex items-center w-full top-0 self-center mx-0 py-4 bg-transparent backdrop-blur border border-black">
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
            {menu.map(([title, url]) => (
                <Link href={url}>
                    <p className="block text-center text-gray-400 hover:text-blue-400 text-md font-bold px-3">{title}</p>
                </Link>
            ))}
        </div>
    )
}

export default Navbar;