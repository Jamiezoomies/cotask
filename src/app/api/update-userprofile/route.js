import pool from "../middleware/database";
import bcrypt from "bcryptjs";
import {getClaimFromJwtToken, getJwtTokenFromHeaders} from "../lib/actions";
import {mkdir, writeFile} from "fs/promises"
import path from "path"

export async function POST(req) {
    const token = getJwtTokenFromHeaders(req.headers, 'Bearer')
    const claim = await getClaimFromJwtToken(token)
    if (!token || !claim) {
        return new Response(null, { status: 401, statusText: "The token is invalid." });
    }

    const userId = claim.id

    const {image_data, username, bio} = await req.json()

    const buffer = Buffer.from(image_data, 'base64')
    const imagepath = "/uploads/" + userId + "/profile.png";

    try {
        await writeFile(path.join(process.cwd(), "public" + imagepath), buffer);
    }
    catch (error) {
        await mkdir("public/uploads/" + userId);
        await writeFile(path.join(process.cwd(), "public" + imagepath), buffer);
    }

    const userValues = [imagepath, username, bio, userId]

    const query = `
    UPDATE Users
    SET profile_picture_url = $1, username = $2, bio = $3
    WHERE id = $4`;

    try {
        const updateUserResponse = await pool.query(query, userValues)
        if (updateUserResponse.rowCount > 0) {
            return new Response(null, { status: 201, statusText: "The profile has been updated successfully."})
        } else {
            return new Response(null, { status: 404, statusText: "User not found." })
        }
    } catch (error) {
        console.error(error)
        return new Response(null, { status: 500, statusText: "An internal error has occurred."})
    }
}