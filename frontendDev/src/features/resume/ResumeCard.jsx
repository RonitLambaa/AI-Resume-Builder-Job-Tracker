// src/features/resume/ResumeCard.jsx
import React from "react";
import { Link } from "react-router-dom";

function ResumeCard({ resume, index = -1, classes = "w-80 h-96" }) {
  // gradient colors
  const colors = [
    "bg-gradient-to-r from-rose-400 to-violet-500",
    "bg-gradient-to-r from-pink-500 to-orange-400",
    "bg-gradient-to-r from-green-400 to-teal-500",
    "bg-gradient-to-r from-indigo-500 to-pink-500",
    "bg-gradient-to-r from-purple-500 to-cyan-400",
    "bg-gradient-to-r from-blue-400 to-teal-400",
    "bg-gradient-to-r from-emerald-400 to-lime-400",
    "bg-gradient-to-r from-sky-400 to-indigo-500",
  ];

  if (index === -1) index = Math.floor(Math.random() * colors.length);
  const color = colors[index % colors.length];

  return (
    <Link to={`/resumes/${resume._id}`}>
      <div
        className={` hover:scale-104 group relative rounded-lg shadow-lg transition-transform duration-500 cursor-pointer overflow-hidden ${classes} ${color}`}
      >
        {/* Default Title */}
        <div className="absolute inset-0 flex items-center justify-center px-3 transition-opacity duration-500 group-hover:opacity-0">
          <h2 className="font-bold text-[clamp(1rem,5vw,2rem)] text-white text-center leading-tight">
            {resume.title}
          </h2>
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-2
                     bg-black/25 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     overflow-auto"
        >
          {/* Summary */}
          {resume.sections.summary && (
            <p className="text-[clamp(0.75rem,3vw,1rem)] text-white font-medium mb-2 leading-snug">
              {resume.sections.summary}
            </p>
          )}

          {/* Skills */}
          <div className="flex flex-wrap justify-center gap-2 max-h-32 overflow-auto w-full">
            {resume.sections.skills?.slice(0, 5).map((skill, idx) => (
              <span
                key={idx}
                className="text-[clamp(0.6rem,2vw,0.875rem)] bg-white text-emerald-600 px-2 py-1 rounded-full shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ResumeCard;
