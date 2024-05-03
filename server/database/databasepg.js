"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.connectPg = void 0;
var Client = require('pg').Client;
var client = new Client({
    host: 'home-harmony-db.cem2euk08pqo.us-east-1.rds.amazonaws.com',
    user: 'postgres',
    port: 5432,
    password: 'Mta159753!',
    database: 'homeHarmonyDB'
});
function connectPg() {
    client.connect(function (err) {
        if (err) {
            console.error('Error connecting to PostgreSQL:', err.stack);
            return;
        }
        console.log('Connected to PostgreSQL database');
    });
}
exports.connectPg = connectPg;
function query(query, values) {
    return client.query(query, values);
}
exports.query = query;
//client.end();
exports.default = client;
