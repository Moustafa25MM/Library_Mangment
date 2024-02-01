import { Request, Response, NextFunction } from 'express';

const isAdmin = (request: any, response: Response, next: NextFunction) => {
  if (request.user && request.user.role === 'ADMIN') {
    next();
  } else {
    return response
      .status(403)
      .json({ error: 'Forbidden: Requires admin role' });
  }
};

const isUser = (request: any, response: Response, next: NextFunction) => {
  if (request.user && request.user.role === 'USER') {
    next();
  } else {
    return response
      .status(403)
      .json({ error: 'Forbidden: Requires user role' });
  }
};

export { isAdmin, isUser };
