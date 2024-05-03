

const client = require('./database/databasepg');
import * as express from 'express';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (await validateLogin(email, password)) {
        res.status(200).json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
});

async function validateLogin(email: string, password: string): Promise<boolean> {
    const query = 'SELECT u.password FROM usersTable u WHERE u.email = $1';
    const values = [email];
    const result = await client.query(query, values);
    const password_from_table = result.rows[0]?.password;
    return password === password_from_table;
    
}

export default router;