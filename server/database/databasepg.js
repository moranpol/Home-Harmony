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
//client.end();
exports.default = client;
