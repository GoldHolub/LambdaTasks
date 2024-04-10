import express from 'express';
import JsonStorageController from '../controllers/jsonStorageController.js';

const router = express.Router();

router.post('/:path', JsonStorageController.storeJson);
router.get('/:path', JsonStorageController.getJson);

export default router;