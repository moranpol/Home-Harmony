const {Client} = require('pg');

const client = new Client({
    host: 'home-harmony-db.cem2euk08pqo.us-east-1.rds.amazonaws.com',
    user: 'postgres',
    port:5432,
    password: 'Mta159753!',
    database: 'homeHarmonyDB'
})

function connectPg(){
    client.connect((err: Error) => {
        if (err) {
            console.error('Error connecting to PostgreSQL:', err.stack);
            return;
        }
        console.log('Connected to PostgreSQL database');
    });
}

function query(query: string, values: any[]){
    return client.query(query, values); 
}

export {connectPg, query};
//client.end();
export default client;