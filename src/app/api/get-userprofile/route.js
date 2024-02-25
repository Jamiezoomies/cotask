import pool from "../../middleware/database";
import { getJwtTokenFromHeaders, getClaimFromJwtToken } from "../../lib/actions";

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).end(); 
    }

    const token = getJwtTokenFromHeaders(req.headers, 'Bearer');
    const claim = await getClaimFromJwtToken(token);
    if (!claim) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = claim.id;

    const query = `
    SELECT username, email, profile_picture AS image, bio
    FROM Users
    WHERE id = $1`;

    try {
        const { rows } = await pool.query(query, [userId]);
        if (rows.length > 0) {
            return res.status(200).json(rows[0]);
        } else {
            return res.status(404).json({ message: "Profile not found." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}