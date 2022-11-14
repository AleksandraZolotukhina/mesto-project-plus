import { JwtPayload, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ERROR_AUTHORIZATED } from '../utils/error';

// eslint-disable-next-line consistent-return
export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(ERROR_AUTHORIZATED).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = verify(authorization.replace('Bearer ', ''), 'super-strong-secret');
  } catch (err) {
    return res
      .status(ERROR_AUTHORIZATED)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload as {_id: JwtPayload};
  next();
};
