import { generateRateLimiter } from '../middlewares/rateLimiter';

export const searchRateLimiter = generateRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
});
