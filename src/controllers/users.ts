import { Request, Response } from 'express';
import user from '../models/user';
import { ERROR_BAD_REQUEST, ERROR_NOT_FOUND, ERROR_SERVER } from '../utils/error';

export const getUsers = (_req: Request, res: Response) => {
  user.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

export const getUser = (req: Request, res: Response) => {
  user.findById(req.params.userId)
    .then((userInformation) => res.status(200).send(userInformation))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  user.create({ name, about, avatar })
    .then((newUser) => res.status(200).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

export const updateUser = (req: Request, res: Response) => {
  const { name, about } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((userInformation) => {
      res.status(200).send(userInformation);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

export const updateUserAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updateAvatar) => res.status(200).send(updateAvatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};
