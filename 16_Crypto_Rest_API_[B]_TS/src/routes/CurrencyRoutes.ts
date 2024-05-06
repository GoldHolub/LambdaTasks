import express, { Router } from "express";
import { CurrencyController } from "../controllers/CurrencyController.js";
const router: Router = express.Router();

router.get('/cryptocurrency', CurrencyController.getCryptoDataInRange);
router.get('/cryptocurrency/list', CurrencyController.getCryptoDataList);

export default router;