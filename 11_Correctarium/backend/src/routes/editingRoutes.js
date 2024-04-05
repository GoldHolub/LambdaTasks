import express from 'express';
import  editingController from '../controllers/EditingController.js';

const router = express.Router();

router.post('/editing', editingController);

export default router;