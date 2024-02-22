'use server'
import pool from "/src/app/utils/database"

export default async function createGroup(formData) {
    const values = [formData.get('name'), formData.get('description'), getRandomUrl()]
    const insert_query = `
    INSERT INTO Channels (name, description, join_url)
    VALUES ($1, $2, $3)
    RETURNING *`

    try{
        const { rowCount, rows } = await pool.query(insert_query, values)
        if (rowCount > 0) {
            console.log(rows[0])
            return rows[0]
        }
        
    } catch (error) {
        console.log(error)
    }
    
    return null
}

function getRandomUrl() {
    let length = 10
    let result = 'http://localhost:3000/';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}