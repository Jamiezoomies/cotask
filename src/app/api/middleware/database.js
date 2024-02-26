import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'database-cotask.cmtmi3jexvz5.us-west-1.rds.amazonaws.com',
    database: 'postgres',
    password: 'PostgresCotask!',
    port: '5432',
});

const db = async (text, params) => {
    /*
    const client = await pool.connect();
    try {
        const result = await client;
        console.log('Connected to the database.');
        return result;
    } finally {
        client.release();
    }
    */
};

export default pool;