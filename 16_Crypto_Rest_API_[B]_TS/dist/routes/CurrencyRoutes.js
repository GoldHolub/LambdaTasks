import express from "express";
import { CurrencyController } from "../controllers/CurrencyController.js";
const router = express.Router();
router.get('/cryptocurrency', CurrencyController.getCryptoDataInRange);
router.get('/cryptocurrency/list', CurrencyController.getCryptoDataList);
export default router;
//# sourceMappingURL=CurrencyRoutes.js.map