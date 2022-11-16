import { Response, Request, NextFunction } from 'express';
import BadRequest from '../utils/errors/BadRequest';
import NotFound from '../utils/errors/NotFound';
import Forbidden from '../utils/errors/Forbidden';
import card from '../models/card';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  card.create({ name, link, owner: req.user._id })
    .then((cardInformation) => res.send(cardInformation))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  card.findById(req.params.cardId)
    .then((cardInformation) => {
      if (!cardInformation) {
        throw new NotFound('Карточка по указанному _id не найдена');
      } else if (cardInformation.owner.toString() !== req.user._id) {
        throw new Forbidden('Нельзя удалить чужую карточку');
      } else {
        card.deleteOne({ _id: req.params.cardId })
          .then(() => {
            res.send({ message: 'Карточка успешно удалена' });
          })
          .catch(next);
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

export const addLikeCard = (req: Request, res: Response, next: NextFunction) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((cardInformation) => {
      if (!cardInformation) {
        throw new NotFound('Карточка по указанному _id не найдена');
      } else {
        res.send(cardInformation);
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

export const deleteLikeCard = (req: Request, res: Response, next: NextFunction) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cardInformation) => {
      if (!cardInformation) {
        throw new NotFound('Карточка по указанному _id не найдена');
      } else {
        res.send(cardInformation);
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
