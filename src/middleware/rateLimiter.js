import { v4 as uuidv4 } from "uuid";
import { config } from "../config/env.js";

const rateLimitStore = new Map();
const windowMs = config.rateWindowSec * 1000;

// 🧹 AUTO CLEANUP JOB
setInterval(() => {
  const now = Date.now();

  for (const [userId, userData] of rateLimitStore.entries()) {
    if (now - userData.startTime > windowMs) {
      rateLimitStore.delete(userId);
    }
  }
}, windowMs);

const rateLimiter = (req, res, next) => {
  // 1️⃣ Identify user
  let userId = req.headers["x-user-id"];

  if (!userId) {
    userId = uuidv4();
    res.setHeader("X-User-Id", userId);
  }

  const currentTime = Date.now();
  const windowMs = config.rateWindowSec * 1000;

  // 2️⃣ Check if user exists in Map
  if (!rateLimitStore.has(userId)) {
    rateLimitStore.set(userId, {
      count: 1,
      startTime: currentTime,
    });

    setRateLimitHeaders(
      res,
      config.rateLimit,
      config.rateLimit - 1,
      config.rateWindowSec,
    );
    return next();
  }

  const userData = rateLimitStore.get(userId);
  const timePassed = currentTime - userData.startTime;

  // 3️⃣ Reset window if expired
  if (timePassed > windowMs) {
    rateLimitStore.set(userId, {
      count: 1,
      startTime: currentTime,
    });

    setRateLimitHeaders(
      res,
      config.rateLimit,
      config.rateLimit - 1,
      config.rateWindowSec,
    );
    return next();
  }

  // 4️⃣ Check limit
  if (userData.count >= config.rateLimit) {
    const resetTime = Math.ceil((windowMs - timePassed) / 1000);

    setRateLimitHeaders(res, config.rateLimit, 0, resetTime);

    return res.status(429).json({
      error: "rate_limited",
      message: "Too many requests, please try again later.",
    });
  }

  // 5️⃣ Increment request count
  userData.count += 1;
  rateLimitStore.set(userId, userData);

  const remaining = config.rateLimit - userData.count;
  const resetTime = Math.ceil((windowMs - timePassed) / 1000);

  setRateLimitHeaders(res, config.rateLimit, remaining, resetTime);
  next();
};

// Helper function for headers
const setRateLimitHeaders = (res, limit, remaining, reset) => {
  res.setHeader("X-RateLimit-Limit", limit);
  res.setHeader("X-RateLimit-Remaining", remaining);
  res.setHeader("X-RateLimit-Reset", reset);
};

export default rateLimiter;
