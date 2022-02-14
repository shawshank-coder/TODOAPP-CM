const { Pool } = require('pg')
// const dotenv = require('dotenv');
// dotenv.config({ path: './../config.env' });
// console.log(process.env.PORT);

const pool = new Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DATABASE,
    password: process.env.DBPASS,
    port: process.env.DBPORT,
})


// pool.on('error', (err, client) => {
//     console.error('Unexpected error on idle client', err)
//     process.exit(-1)
// })

module.exports = pool;



