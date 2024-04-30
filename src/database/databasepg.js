"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Client = require('pg').Client;
var client = new Client({
    host: 'localhost',
    user: 'postgres',
    port: 5432,
    password: 'ofirko30',
    database: 'home-harmonyDB'
});
client.connect(function (err) {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err.stack);
        return;
    }
    console.log('Connected to PostgreSQL database');
});
client.query('SELECT * from usersTable', function (err, res) {
    console.log(res);
    client.end();
});
exports.default = client;
