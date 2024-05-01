import Client from './database/databasepg';
const express = require('express');
const app = express();
const PORT = 5000;
const router = require('./login.ts');


app.use(express.json());
app.use('/api', router);
app.use(Client.connect((err: Error) => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err.stack);
        return;
    }
    console.log('Connected to PostgreSQL database');
}));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

export {}