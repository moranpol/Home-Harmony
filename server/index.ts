import {connectPg} from './database/databasepg';
import * as express from 'express';
import loginRouter from './login';
const app = express();
const PORT = 5000;



app.use(express.json());
app.use('/api', loginRouter);

connectPg();

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

export {}