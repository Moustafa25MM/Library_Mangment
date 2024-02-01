import express, { Express, Response, Request } from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import prisma from './database';
import { indexRouter } from './routes';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(morgan('tiny'));

prisma.$connect().then(() => {
  console.log('Successfully Connected to Database.');
});

app.use(indexRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The server is running on port " ${port}"`);
});
