"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var databasepg_1 = require("./database/databasepg");
var express = require("express");
var login_1 = require("./login");
var app = express();
var PORT = 5000;
app.use(express.json());
app.use('/api', login_1.default);
(0, databasepg_1.connectPg)();
app.listen(PORT, function () {
    console.log("Server listening on port ".concat(PORT));
});
