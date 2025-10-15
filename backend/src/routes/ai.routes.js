import { Router } from "express";
import { improveSummary, improveProjectDescription } from "../controllers/ai.controller.js";

const router = Router();

router.post("/summary", improveSummary);
router.post("/project", improveProjectDescription);

export default router;
