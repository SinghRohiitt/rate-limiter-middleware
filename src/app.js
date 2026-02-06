import express from "express";
import testRoutes from "./routes/test.routes.js";
import rateLimiter from "./middleware/rateLimiter.js";

const app = express();

// built-in middleware
app.use(express.json());

app.use(rateLimiter);
// routes
app.use("/api", testRoutes);

// health check
app.get("/", (req, res) => {
  res.json({ message: "Rate limiter service is running" });
});

export default app;
