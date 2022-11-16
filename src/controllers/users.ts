import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import user from '../models/user';
import BadRequest from '../utils/errors/BadRequest';
import NotFound from '../utils/errors/NotFound';
import Conflict from '../utils/errors/Conflict';

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password)
    .then((userInformation) => {
      res
        .send({
          token: jwt.sign({ _id: userInformation._id }, 'super-strong-secret', { expiresIn: '7d' }),
        });
    })
    .catch(next);
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  user.find({})
    .then((users) => res.send(users))
    .catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  user.findById(req.params.userId)
    .then((userInformation) => {
      if (!userInformation) {
        throw new NotFound('Пользователь по указанному _id не найден');
      } else {
        res.send(userInformation);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Запрашиваемый id некорректен'));
      } else {
        next(err);
      }
    });
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  user.findById(req.user._id)
    .then((userInformation) => {
      if (!userInformation) {
        throw new NotFound('Пользователь по указанному _id не найден');
      } else {
        res.send(userInformation);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Запрашиваемый id некорректен'));
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  user.findOne({ email })
    .then((userInf) => {
      if (userInf) {
        throw new Conflict('Пользователь с таким email уже существует');
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => user.create({
            name, about, avatar, email, password: hash,
          }))
          .then((userInformation) => {
            res.send(userInformation);
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequest('Переданы некорректные данные при создании пользователя'));
            } else {
              next(err);
            }
          });
      }
    })
    .catch(next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((userInformation) => {
      if (!userInformation) {
        throw new NotFound('Пользователь по указанному _id не найден');
      } else {
        res.send(userInformation);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Запрашиваемый id некорректен'));
      } else {
        next(err);
      }
    });
};

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  if (avatar === undefined) {
    throw new BadRequest('Переданы некорректные данные при обновлении аватара');
  }

  user.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updateAvatar) => {
      if (!updateAvatar) {
        throw new NotFound('Пользователь по указанному _id не найден');
      } else {
        res.send(updateAvatar);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Запрашиваемый id некорректен'));
      } else {
        next(err);
      }
    });
};
