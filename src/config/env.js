import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  rateLimit: Number(process.env.RATE_LIMIT) || 5,
  rateWindowSec: Number(process.env.RATE_WINDOW_SEC) || 60,
};
