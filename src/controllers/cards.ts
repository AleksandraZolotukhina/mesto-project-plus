import { Response, Request } from 'express';
import card from '../models/card';
import { ERROR_BAD_REQUEST, ERROR_NOT_FOUND, ERROR_SERVER } from '../utils/error';

export const getCards = (req: Request, res: Response) => {
  card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  card.create({ name, link, owner: req.user._id })
    .then((cardInformation) => res.send(cardInformation))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

export const deleteCard = (req: Request, res: Response) => {
  card.findByIdAndRemove(req.params.cardId)
    .then((cardInformation) => {
      if (!cardInformation) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      } else {
        res.send(cardInformation);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Запрашиваемый id некорректен' });
      }
      return res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

export const addLikeCard = (req: Request, res: Response) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((cardInformation) => {
      if (!cardInformation) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      } else {
        res.send(cardInformation);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Запрашиваемый id некорректен' });
      }
      return res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};

export const deleteLikeCard = (req: Request, res: Response) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cardInformation) => {
      if (!cardInformation) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка по указанному _id не найдена' });
      } else {
        res.send(cardInformation);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Запрашиваемый id некорректен' });
      }
      return res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' });
    });
};
