import { generateRateLimiter } from '../middlewares/rateLimiter';

export const loginRateLimiter = generateRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
});
