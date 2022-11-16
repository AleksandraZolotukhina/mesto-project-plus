import express, { Response, Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import error from './middlewares/error';
import { requestLogger, errorLogger } from './middlewares/logger';
import { signinValidation, createUserValidation } from './utils/validation';
import auth from './middlewares/auth';
import NotFound from './utils/errors/NotFound';
import { login, createUser } from './controllers/users';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', signinValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((_req: Request, res: Response, next: NextFunction) => {
  next(new NotFound('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());
app.use(error);

app.listen(PORT);
