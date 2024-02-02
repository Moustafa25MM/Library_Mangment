import express, { Express, Response, Request } from 'express';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import prisma from './database';
import { indexRouter } from './routes';
import { createDefaultAdmin } from './defaultAdmin';
import helmet from 'helmet';

dotenv.config();

export const app: Express = express();

// Security middlewares
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use(express.json());
app.use(morgan('tiny'));

prisma.$connect().then(() => {
  console.log('Successfully Connected to Database.');
  createDefaultAdmin();
});

app.use(indexRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`The server is running on port " ${port}"`);
});
