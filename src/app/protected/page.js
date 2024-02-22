import { protectFromUnauthorized } from "../lib/actions";

export default async function ProtectedPage() {
    const session = await protectFromUnauthorized()
    const username = session?.username
    
    if (!username) {
        return (
            <>
                <h3>Protected Page</h3>   
            </>
        )
    }

    return (
        <>
            <h3>Welcome!</h3>
        </>
    )
}