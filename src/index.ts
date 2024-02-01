import express, { Express, Response, Request } from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(morgan('tiny'));

app.use('/', (req: Request, res: Response) => {
  console.log('Index');
  return res.status(200).send('Hello from Node TS');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The server is running on port " ${port}"`);
});
