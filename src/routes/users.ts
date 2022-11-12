import { Router } from 'express';
import {
  getUsers, createUser, getUser, updateUser, updateUserAvatar, login,
} from '../controllers/users';
import auth from '../middlewares/auth';

const userRouter = Router();

userRouter.post('/signin', login);
userRouter.post('/signup', createUser);

userRouter.use(auth);

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
