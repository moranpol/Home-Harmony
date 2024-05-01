const {Client} = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port:5432,
    password: 'ofirko30',
    database: 'home-harmonyDB'
})





//client.end();
export default client;