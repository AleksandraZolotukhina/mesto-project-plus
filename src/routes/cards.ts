import { Router } from 'express';
import {
  getCards, createCard, deleteCard, addLikeCard, deleteLikeCard,
} from '../controllers/cards';
import auth from '../middlewares/auth';

const cardRouter = Router();

cardRouter.use(auth);

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', addLikeCard);
cardRouter.delete('/:cardId/likes', deleteLikeCard);

export default cardRouter;
