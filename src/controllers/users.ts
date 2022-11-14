import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import user from '../models/user';
import {
  ERROR_BAD_REQUEST, ERROR_SERVER, ERROR_NOT_FOUND, ERROR_AUTHORIZATED,
} from '../utils/error';

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password)
    .then((userInformation) => {
      res
        .send({
          token: jwt.sign({ _id: userInformation._id }, 'super-strong-secret', { expiresIn: '7d' }),
        });
    })
    .catch((err) => {
      res
        .status(ERROR_AUTHORIZATED)
        .send({ message: err.message });
    });
};

export const getUsers = (req: Request, res: Response) => {
  user.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

export const getUser = (req: Request, res: Response) => {
  user.findById(req.params.userId)
    .then((userInformation) => {
      if (!userInformation) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send(userInformation);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Запрашиваемый id некорректен' });
      }
      return res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

export const getCurrentUser = (req: Request, res: Response) => {
  user.findById(req.user._id)
    .then((userInformation) => {
      if (!userInformation) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send(userInformation);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Запрашиваемый id некорректен' });
      }
      return res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

export const createUser = (req: Request, res: Response) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => {
      user.create({
        name, about, avatar, email, password: hash,
      });
    })
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
      if (!userInformation) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send(userInformation);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Запрашиваемый id некорректен' });
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
    .then((updateAvatar) => {
      if (!updateAvatar) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.send(updateAvatar);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Запрашиваемый id некорректен' });
      }
      return res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};
