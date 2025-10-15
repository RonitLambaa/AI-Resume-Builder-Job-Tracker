import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobs.controllers.js";

const router = Router();

router.post("/", verifyJWT, createJob);
router.get("/", verifyJWT, getJobs);
router.get("/:jobId", verifyJWT, getJobById);
router.put("/:jobId", verifyJWT, updateJob);
router.delete("/:jobId", verifyJWT, deleteJob);

export default router;