import { Pool } from 'pg';

/*
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})
*/

// Connect to the Postgre SQL database server running on AWS.
const pool = new Pool({
    user: 'postgres',
    host: 'database-cotask.cmtmi3jexvz5.us-west-1.rds.amazonaws.com',
    database: 'postgres',
    password: 'PostgresCotask!',
    port: '5432',
});

export default pool;