import pool from "../middleware/database";
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../lib/actions";

export async function GET(req, res) {
    if (req.method !== 'GET') {
        //return res.status(405).end();
        return new Response(null, { status: 405 })
    }

    const token = getJwtTokenFromHeaders(req.headers, 'Bearer');
    const claim = await getClaimFromJwtToken(token);
    if (!claim) {
        return new Response(null, { status: 401, statusText: "Unauthorized" })
        //return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = claim.id;

    const query = `
    SELECT username, email, profile_picture_url AS image, bio
    FROM Users
    WHERE id = $1`;
// profile_picture AS image,
    try {
        const { rows } = await pool.query(query, [userId]);
        if (rows.length > 0) {
            //return res.status(200).json(rows[0]);
            return new Response(JSON.stringify(rows[0]), { status: 200 })
        } else {
            //return res.status(404).json({ message: "Profile not found." });
            return new Response(null, { status: 404, statusText: "Profile not found." })
        }
    } catch (error) {
        console.error(error);
        //return res.status(500).json({ message: "Internal server error" });
        return new Response(null, { status: 500, statusText: "Internal server error" })
    }
}