import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/db";
import cookieParser from "cookie-parser";
import morganMiddleware from "./loggers/morgan.logger";
import logger from "./loggers/winston.logger";
import { errorHandler } from "./middlewares/error.middleware";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 6969;

const app = express();

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN!, process.env.CLIENT_URL!],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morganMiddleware);

app.route("/").get((req: Request, res: Response) => {
  res.status(200).send("Server is running");
});

import healthCheckRouter from "./routes/healthcheck.route";
import authRouter from "./routes/users.route";
import motorcycleRouter from "./routes/motorcycles.route";
import bookingRouter from "./routes/bookings.route";
import reviewRouter from "./routes/reviews.route";
import couponRouter from "./routes/promo-codes.route";
import cartRouter from "./routes/carts.route";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/users", authRouter);
app.use("/api/v1/motorcycles", motorcycleRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/coupons", couponRouter);
app.use("/api/v1/carts", cartRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info("⚙️  Server is running on PORT: " + process.env.PORT);
    });
  })
  .catch((error) => {
    logger.error("MongoDB Connection Error: ", error);
  });

app.use(errorHandler);
