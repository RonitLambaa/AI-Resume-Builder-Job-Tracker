import { Job } from "../models/job.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import {asyncHandler} from "../utils/asyncHandler.js";

// Create Job
export const createJob = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { company, role, location, status, notes, resumeUsed, appliedDate } = req.body;

    const job = await Job.create({
        user: userId,
        company,
        role,
        location,
        status,
        notes,
        resumeUsed,
        appliedDate // if not provided, defaults to Date.now()
    });

    return res.status(201).json(
        new ApiResponse(201, job, "Job created successfully")
    );
});


// Get all jobs of a user
export const getJobs = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // populate resumeUsed (optional)
  const jobs = await Job.find({ user: userId }).populate("resumeUsed", "title");

  return res
    .status(200)
    .json(new ApiResponse(200, jobs, "Jobs fetched successfully"));
});

// Get job by ID
export const getJobById = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const job = await Job.findOne({ _id: jobId, user: userId }).populate(
    "resumeUsed",
    "title"
  );
  if (!job) throw new ApiError(404, "Job not found or not authorized");

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job fetched successfully"));
});

// Update job
export const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const job = await Job.findOneAndUpdate(
    { _id: jobId, user: userId },
    req.body,
    { new: true, runValidators: true }
  ).populate("resumeUsed", "title");

  if (!job) throw new ApiError(404, "Job not found or not authorized");

  return res
    .status(200)
    .json(new ApiResponse(200, job, "Job updated successfully"));
});

// Delete job
export const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const job = await Job.findOneAndDelete({ _id: jobId, user: userId });
  if (!job) throw new ApiError(404, "Job not found or not authorized");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Job deleted successfully"));
});
