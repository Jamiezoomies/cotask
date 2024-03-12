import { getClaimFromJwtToken, getJwtTokenFromHeaders } from "../lib/actions"

export async function GET ( req ) {
    // Get the auth token from header
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')

    // no token results 401
    if (!token) {
        return new Response(null, { status: 401, statusText: "The session seems expired." });
    }


    try {
        // verify the token and get data in payload
        const decoded = await getClaimFromJwtToken(token)
        if (decoded) {
            return new Response(JSON.stringify(decoded), { status: 200, statusText: "The session is valid." });
        }
    } catch (error) {
        console.error("Error while verifying JWT token:", error);
        return new Response(null, { status: 500, statusText: "An unknown error has occurred." });
    }

    return new Response(null, { status: 401, statusText: "The session seems expired." });
}