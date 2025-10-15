import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Job belongs to a specific user
      required: true,
    },
    company: {
      type: String,
      required: true,
    },      
    role: {
      type: String,
      required: true,
    },
    location: String,
    status: {
      type: String,
      enum: ["applied", "interview", "offer", "rejected", "wishlist"],
      default: "applied",
    },
    appliedDate: {
      type: Date,
      default: Date.now(),
    },
    notes: {
      type: String, // user’s personal notes about job
    },
    resumeUsed: {
      type: Schema.Types.ObjectId,
      ref: "Resume", // Which resume was used for this job application
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
