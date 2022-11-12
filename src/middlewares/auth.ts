import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line consistent-return
export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  let payload;
  try {
    payload = jwt.verify(authorization.replace('Bearer ', ''), 'super-strong-secret');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
