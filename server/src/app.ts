import type { Application } from "express";
import express from "express";
import { authRouter } from "./routes/auth.routes.js";
import { applicationRouter } from "./routes/application.routes.js";
import { jobRouter } from "./routes/job.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";

export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.HOST_URL,
    credentials: true,
}));

app.use('/api/auth', authRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/jobs', jobRouter);

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "localhost", (error) => {
    if (error) throw error;
    console.log(`Express app is listening on port ${PORT}.`);
});

