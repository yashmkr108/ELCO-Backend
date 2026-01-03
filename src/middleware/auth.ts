import { RequestHandler, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpStatus } from '../constants/HttpStatus';

export const auth: RequestHandler = (req: Request, res: Response, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_USER!) as { id: string };

    req.id = decode.id;

    next();
  } catch (error) {
    res.status(HttpStatus.UNAUTHORIZED).json({
      msg: 'Unauthorized Access: ' + error,
    });
  }
};
