import express from 'express';
import { UrlController } from '../controllers/UrlController.js';

const router = express.Router();
const urlController = new UrlController();
router.post('/shorten', UrlController.createShortUrl);
router.get('/:shortUrl', UrlController.redirectToOriginalUrl);

export default router;