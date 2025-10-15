
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchResumes } from "../features/resume/resumeSlice"; 
import ResumeCard from "../features/resume/ResumeCard";
import { PlusCircleIcon } from "@heroicons/react/24/outline"; 
import { motion } from "framer-motion";

function ResumesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumes, loading } = useSelector((state) => state.resumes);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  if (loading) return <p>Loading resumes...</p>;

  return (
    <div className="py-6 ml-13">
      <h1 className="text-5xl font-bold mb-6 pb-5 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
        My Resumes
      </h1>
      <div className="flex flex-wrap gap-10 justify-start">
        {resumes.map((resume, idx) => (
          <motion.div
            key={resume._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx *0.1 }}
          >
            <ResumeCard resume={resume} index={idx} />
          </motion.div>
        ))}

        {/* Add Resume Card with animation */}
        <motion.div
          onClick={() => navigate("/resumes/add")}
          className="flex flex-col h-100 w-80 items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: resumes.length * 0.1 }}
        >
          <PlusCircleIcon className="w-20 h-20 text-blue-500 mb-2" />
          <span className="text-blue-500 font-semibold text-xl">
            Add Resume
          </span>
        </motion.div>
      </div>
    </div>
  );
}

export default ResumesPage;
