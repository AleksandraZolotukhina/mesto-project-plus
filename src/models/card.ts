import mongoose from 'mongoose';
import validator from 'validator';

interface ICardSchema{
  name: string,
  link: string,
  owner: mongoose.Types.ObjectId,
  likes: Array<mongoose.Types.ObjectId>,
  createdAt: Date,
}

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlenght: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (avatar: string) => validator.isURL(avatar, { protocols: ['http', 'https'] }),
      message: 'Некорректная ссылка',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [{
    type: mongoose.Types.ObjectId,
    default: [],
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICardSchema>('card', cardSchema);
