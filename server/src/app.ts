import type { Application } from 'express';
import express from 'express';
import { authRouter } from './routes/auth.routes.js';
import { applicationRouter } from './routes/application.routes.js';
import { userRouter } from './routes/user.routes.js';
import { jobRouter } from './routes/job.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import { preferencesRouter } from './routes/preferences.routes.js';

export const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.HOST_URL,
    credentials: true,
  }),
);

app.use((req, res, next) => {
  //console.log(req);
  //console.log(req.body);
  next();
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/preferences', preferencesRouter);

app.use(errorHandler);
