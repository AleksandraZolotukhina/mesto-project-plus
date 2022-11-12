import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { ERROR_NOT_FOUND } from './utils/error';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: Request, res: Response, next) => {
  req.user = {
    _id: '6367cf71688a3a1d1059fc31',
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req: Request, res: Response) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);
