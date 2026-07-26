import { Router } from 'express';
import { applicationController } from '../controllers/applications.controller.js';
import { verifyToken } from '../middleware/auth.js';

export const applicationRouter = Router();

applicationRouter.get('/:id', verifyToken, applicationController.getById);
applicationRouter.get('/', verifyToken, applicationController.list);
applicationRouter.post('/:id', verifyToken, applicationController.create);
applicationRouter.patch('/:id', verifyToken, applicationController.update);
applicationRouter.delete('/:id', verifyToken, applicationController.remove);
