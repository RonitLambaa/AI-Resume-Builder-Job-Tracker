import {asyncHandler} from "../utils/asyncHandler.js";
import { Resume } from "../models/resume.models.js";
import {ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

// Create a new resume
export const createResume = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { title, sections, aiSuggestions } = req.body;

    const resume = await Resume.create({
        user: userId,
        title,
        sections,
        aiSuggestions
    });

    return res.status(201).json(
        new ApiResponse(201, resume, "Resume created successfully")
    );
});

// Get all resumes of logged-in user
export const getResumes = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const resumes = await Resume.find({ user: userId });
    return res.status(200).json(
        new ApiResponse(
            200,
            resumes,
            "Resumes fetched successfully"
        )
    );
});

// Get a specific resume by ID
export const getResumeById = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;
    const userId = req.user._id;

    const resume = await Resume.findOne({ _id: resumeId, user: userId });
    if (!resume) throw new ApiError(404, "Resume not found");

    return res.status(200).json(
        new ApiResponse(200, resume, "Resume fetched successfully")
    );
});

// Update a resume
export const updateResume = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;
    const userId = req.user._id;
    const updates = req.body;

    const resume = await Resume.findOne({ _id: resumeId, user: userId });
    if (!resume) throw new ApiError(404, "Resume not found or not authorized");

    // Merge top-level fields
    if (updates.title) resume.title = updates.title;

    // Merge sections deeply instead of replacing
    if (updates.sections) {
        resume.sections = {
            ...resume.sections.toObject(),
            ...updates.sections
        };
    }

    await resume.save();

    return res.status(200).json(
        new ApiResponse(200, resume, "Resume updated successfully")
    );
});


// Delete a resume
export const deleteResume = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;
    const userId = req.user._id;

    const deleted = await Resume.findOneAndDelete({ _id: resumeId, user: userId });
    if (!deleted) throw new ApiError(404, "Resume not found or not authorized");

    return res.status(200).json(
        new ApiResponse(200,
            null,
            "Resume deleted successfully"
        )
    );
});
