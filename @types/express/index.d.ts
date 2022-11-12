import { ObjectId } from 'mongoose';

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface Request {
      user: { _id: string | ObjectId }
    }
  }
}
