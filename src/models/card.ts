import mongoose from 'mongoose';

interface ICardSchema{
  name: string,
  link: string,
  owner: mongoose.Types.ObjectId,
  likes: ReadonlyArray<mongoose.Types.ObjectId>,
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
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  likes: [{
    type: mongoose.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICardSchema>('card', cardSchema);