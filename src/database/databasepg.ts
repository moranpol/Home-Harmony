const {Client} = require('pg');

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    port:5432,
    password: 'ofirko30',
    database: 'home-harmonyDB'
})

client.connect((err: Error) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err.stack);
        return;
    }
    console.log('Connected to PostgreSQL database');
});



//client.end();
export default client;