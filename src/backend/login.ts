import Client from '../database/databasepg';
import { Request, Response } from 'express';

export const login = (req: Request, res: Response) => {
    // Handle login logic
    const { email, password } = req.body;
    // Perform authentication
    if (email === 'example' && password === 'password') {
        // Authentication successful
        res.status(200).json({ message: 'Login successful' });
    } else {
        // Authentication failed
        res.status(401).json({ message: 'Invalid credentials' });
    }
};



function validateLogin(email: string, password: string) {    
    Client.query('SELECT * from usersTable', (err: Error, res: any) => {
        console.log(res);
        
    })
}
export {}