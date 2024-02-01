import { Request, Response } from 'express';

export interface ErrorResponse extends Error {
  status?: number;
}

class RequestHandler {
  sendSuccess(res: Response, message?: string) {
    return (data: any, globalData?: any) => {
      const status = 200;
      res.status(status).json({
        type: 'success',
        message: message || 'Success result',
        data,
        ...globalData,
      });
    };
  }

  sendError(res: Response, error: ErrorResponse, msg = 'Unhandled Error') {
    return res.status(error.status || 500).json({
      type: 'error',
      message: error.message || msg,
      error,
    });
  }
}

export default new RequestHandler();
