import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.post('/login', authController.loginController);
authRouter.post('/create', authController.signUpController);
authRouter.post('/logout', authController.logoutController);
