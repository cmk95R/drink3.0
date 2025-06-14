import { Router } from "express";
import { buyProModules, cancelProModules, renderHireModulesPage } from "../controllers/hireModules.controller.js";

const router = Router();

router.get('/', renderHireModulesPage); // GET /hireModules
router.post('/buy-modules', buyProModules);
router.post('/cancel-modules', cancelProModules);

export default router;