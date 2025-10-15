
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, updateJob, deleteJob } from "../features/jobs/jobSlice";
import { fetchResumes } from "../features/resume/resumeSlice";
import JobCard from "../features/jobs/JobCard";
import ResumeCard from "../features/resume/ResumeCard";
import { motion } from "framer-motion";

function Dashboard() {
  const dispatch = useDispatch();
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);
  const { resumes, loading: resumesLoading } = useSelector((state) => state.resumes);

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleStatusChange = (jobId, newStatus) => {
    dispatch(updateJob({ jobId, data: { status: newStatus } }));
  };

  const handleDeleteJob = (jobId) => {
    dispatch(deleteJob(jobId));
  };

  const handleUpdateNotes = (jobId, newNotes) => {
    dispatch(updateJob({ jobId, data: { notes: newNotes } }));
  };

  // if (jobsLoading || resumesLoading)
  //   return <p className="text-gray-500">Loading dashboard...</p>;

  return (
    <div className="max-w-5xl ml-35 mt-10">
      <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent pb-7">
        Your Activity
      </h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs tracked yet. Go add some!</p>
      ) : (
        <div className="space-y-6">
          {jobs.map((job, idx) => {
            const resume = resumes.find(
              (r) => r._id === (job.resumeUsed?._id || job.resumeUsed)
            );

            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex gap-6 items-start"
              >
                {/* Job Card */}
                <JobCard
                  job={job}
                  onStatusChange={(newStatus) => handleStatusChange(job._id, newStatus)}
                  onDelete={() => handleDeleteJob(job._id)}
                  onUpdateNotes={handleUpdateNotes}
                  resumeTitle={resume?.title}
                  readOnly={true}
                  classes="p-10 gap-7 w-300"
                />

                {/* Resume Card */}
                {resume && (
                  <ResumeCard resume={resume} index={idx} classes="w-65 h-80" />
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
