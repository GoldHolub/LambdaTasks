import express from 'express';
import RegistrationController from '../controllers/RegistrationController.js';

const router = express.Router();

router.post('/sign_up', RegistrationController.signUp);

export default router;
