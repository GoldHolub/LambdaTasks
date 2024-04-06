import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.get('/me/:userId', AuthController.getMe);

export default router;
