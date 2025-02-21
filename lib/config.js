import rateLimit from "express-rate-limit";

export const PORT = process.env.PORT || 3000;

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
});

export const corsOptions = {
  origin: process.env.ORIGINS ? process.env.ORIGINS.split(",") : "*",
  methods: "GET,POST",
};