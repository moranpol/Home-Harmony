"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var databasepg_1 = require("./database/databasepg");
var express = require('express');
var app = express();
var PORT = 5000;
var router = require('./login.ts');
app.use(express.json());
app.use('/api', router);
app.use(databasepg_1.default.connect(function (err) {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err.stack);
        return;
    }
    console.log('Connected to PostgreSQL database');
}));
app.listen(PORT, function () {
    console.log("Server listening on port ".concat(PORT));
});
