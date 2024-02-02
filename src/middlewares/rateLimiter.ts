import rateLimit, {
  RateLimitRequestHandler,
  Options,
} from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Function to create a rate limiter middleware with custom options
export function generateRateLimiter(options: any): RateLimitRequestHandler {
  const defaultOptions: any = {
    windowMs: 15 * 60 * 1000, // Defaults to 15 minutes
    max: 100, // Defaults to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response, next: NextFunction) => {
      res.status(429).json({
        message: 'Too many requests, please try again later.',
      });
    },
  };

  // Combine the default options with the user provided options
  const combinedOptions: Options = { ...defaultOptions, ...options };
  return rateLimit(combinedOptions);
}
