// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import JobCard from "./JobCard";
// import AddJobForm from "./AddJobForm";
// import { fetchJobs, addJob, updateJob, deleteJob } from "./jobSlice";
// import { fetchResumes } from "../resume/resumeSlice";

// function JobTracker() {
//   const dispatch = useDispatch();
//   const { jobs, loading, error } = useSelector((state) => state.jobs);
//   const { resumes } = useSelector((state) => state.resumes);
//   const [showAddForm, setShowAddForm] = useState(false);

//   // Load jobs and resumes on mount
//   useEffect(() => {
//     dispatch(fetchJobs());
//     dispatch(fetchResumes());
//   }, [dispatch]);

//   const handleAddJob = (job) => {
//     dispatch(addJob(job));
//     setShowAddForm(false);
//   };

//   const handleStatusChange = (jobId, newStatus) => {
//     dispatch(updateJob({ jobId, data: { status: newStatus } }));
//   };

//   const handleDeleteJob = (jobId) => {
//     dispatch(deleteJob(jobId));
//   };

//   const handleUpdateNotes = (jobId, newNotes) => {
//     dispatch(updateJob({ jobId, data: { notes: newNotes } }));
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-5xl font-bold mb-6 pb-5 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
//           Job Tracker
//         </h1>
//         <button
//           onClick={() => setShowAddForm(true)}
//           className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
//         >
//           + Add Job
//         </button>
//       </div>

//       {/* Add Form */}
//       {showAddForm && (
//         <AddJobForm
//           resumes={resumes}
//           onSubmit={handleAddJob}
//           onCancel={() => setShowAddForm(false)}
//         />
//       )}

//       {/* Loading & Errors */}
//       {loading && <p className="text-gray-500">Loading jobs...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* Jobs List */}
//       <div className="space-y-4 mt-4">
//         {jobs.length === 0 ? (
//           <p className="text-gray-500">No jobs added yet.</p>
//         ) : (
//           jobs.map((job) => {
//             // Handle both object and string for resumeUsed
//             const resumeTitle =
//               typeof job.resumeUsed === "object"
//                 ? job.resumeUsed?.title
//                 : resumes.find((r) => r._id === job.resumeUsed)?.title;

//             return (
//               <JobCard
//                 key={job._id}
//                 job={job}
//                 onStatusChange={(newStatus) =>
//                   handleStatusChange(job._id, newStatus)
//                 }
//                 onDelete={() => handleDeleteJob(job._id)}
//                 onUpdateNotes={handleUpdateNotes}
//                 resumeTitle={resumeTitle}
//               />
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }

// export default JobTracker;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import JobCard from "./JobCard";
import AddJobForm from "./AddJobForm";
import { fetchJobs, addJob, updateJob, deleteJob } from "./jobSlice";
import { fetchResumes } from "../resume/resumeSlice";
import { motion } from "framer-motion";

function JobTracker() {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const { resumes } = useSelector((state) => state.resumes);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load jobs and resumes on mount
  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleAddJob = (job) => {
    dispatch(addJob(job));
    setShowAddForm(false);
  };

  const handleStatusChange = (jobId, newStatus) => {
    dispatch(updateJob({ jobId, data: { status: newStatus } }));
  };

  const handleDeleteJob = (jobId) => {
    dispatch(deleteJob(jobId));
  };

  const handleUpdateNotes = (jobId, newNotes) => {
    dispatch(updateJob({ jobId, data: { notes: newNotes } }));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-5xl font-bold mb-6 pb-5 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          Job Tracker
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
        >
          + Add Job
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <AddJobForm
          resumes={resumes}
          onSubmit={handleAddJob}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Loading & Errors */}
      {/* {loading && <p className="text-gray-500">Loading jobs...</p>} */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Jobs List */}
      <div className="space-y-4 mt-4">
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs added yet.</p>
        ) : (
          jobs.map((job, idx) => {
            const resumeTitle =
              typeof job.resumeUsed === "object"
                ? job.resumeUsed?.title
                : resumes.find((r) => r._id === job.resumeUsed)?.title;

            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <JobCard
                  job={job}
                  onStatusChange={(newStatus) =>
                    handleStatusChange(job._id, newStatus)
                  }
                  onDelete={() => handleDeleteJob(job._id)}
                  onUpdateNotes={handleUpdateNotes}
                  resumeTitle={resumeTitle}
                />
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default JobTracker;
