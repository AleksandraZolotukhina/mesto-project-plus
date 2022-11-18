import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} from '../controllers/users';
import {
  updateUserValidation,
  updateUserAvatarValidation,
  getUserValidation,
} from '../utils/validation';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get('/:userId', getUserValidation, getUser);
userRouter.patch('/me', updateUserValidation, updateUser);
userRouter.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);

export default userRouter;
