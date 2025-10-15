import mongoose, { Schema } from "mongoose";

const resumeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Links resume to the user
      required: true,
    },
    title: {
      type: String,
      required: true, // e.g. "Backend Developer Resume"
    },
    sections: {
      summary: { type: String },
      education: [
        {
          school: String,
          degree: String,
          startDate: Date,
          endDate: Date,
        },
      ],
      experience: [
        {
          company: String,
          position: String,
          startDate: Date,
          endDate: Date,
          description: String,
        },
      ],
      skills: [String],
      projects: [
        {
          name: String,
          description: String,
          link: String,
        },
      ],
    },
    aiSuggestions: {
      type: String, // store text suggestions from AI API
    },
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", resumeSchema);
