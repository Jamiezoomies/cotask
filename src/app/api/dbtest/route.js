import pool from "../../utils/database";


// localhost:3000/api/dbtest

export async function GET(){
    const query = 'SELECT * from Users';
    const { rows } = await pool.query(query);

    console.log(rows);
    return Response.json({rows});
}