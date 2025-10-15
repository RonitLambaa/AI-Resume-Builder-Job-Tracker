import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createResume,
    getResumes,
    getResumeById,
    updateResume,
    deleteResume
} from "../controllers/resume.controllers.js";

const router = Router();

router.post("/", verifyJWT, createResume);
router.get("/", verifyJWT, getResumes);
router.get("/:resumeId", verifyJWT, getResumeById);
router.put("/:resumeId", verifyJWT, updateResume);
router.delete("/:resumeId", verifyJWT, deleteResume);

export default router;
