import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobProgressBar from "./JobProgressBar";

function JobCard({ job, onStatusChange, onDelete, onUpdateNotes, resumeTitle, readOnly = false, classes = "p-6 gap-4" }) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(job.notes || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChangeStatus = (e) => {
    if (!readOnly) onStatusChange(e.target.value);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(job._id, notesDraft);
    setEditingNotes(false);
  };

  const handleResumeClick = () => {
    if (job.resumeUsed) {
      navigate(`/resumes/${job.resumeUsed._id}`);
    }
  };

  const confirmDelete = () => {
    onDelete(job._id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`bg-white ${classes} rounded-xl shadow flex flex-col  border border-gray-200 relative`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-emerald-600">{job.role}</h2>
          <p className="text-gray-600">{job.company}</p>
          {job.location && (
            <p className="text-gray-500 text-sm">{job.location}</p>
          )}
        </div>

        {/* Hide delete button in readOnly */}
        {!readOnly && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
          >
            Delete
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <JobProgressBar status={job.status} />

      {/* Resume */}
      {job.resumeUsed && resumeTitle && !readOnly && (
        <p
          className="cursor-pointer text-green-600 hover:text-green-700 text-l"
          onClick={handleResumeClick}
        >
          📄 Resume Used: {resumeTitle}
        </p>
      )}

      {/* Details */}
      <div className="text-sm text-gray-700 space-y-2">
        {job.appliedDate && (
          <p>
            <span className="font-medium">Applied on:</span>{" "}
            {new Date(job.appliedDate).toLocaleDateString()}
          </p>
        )}

        {/* Notes */}
        <div className="flex items-start gap-2">
          <span className="font-medium">Notes:</span>

          {/* Read-only → show plain notes only */}
          {readOnly ? (
            <p>{job.notes || "No notes yet"}</p>
          ) : !editingNotes ? (
            <div className="flex items-center gap-2">
              <p>{job.notes || "No notes yet"}</p>
              <button
                onClick={() => setEditingNotes(true)}
                className="text-green-600 text-xs cursor-pointer font-medium"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                className="border px-2 py-1 rounded w-full"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setNotesDraft(job.notes || "");
                    setEditingNotes(false);
                  }}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status update - hidden in readOnly */}
      {!readOnly && (
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">
            Update Status:
          </label>
          <select
            value={job.status}
            onChange={handleChangeStatus}
            className="border rounded px-3 py-1 cursor-pointer"
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {!readOnly && showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 ">
            <h3 className="text-lg font-bold text-gray-800 flex justify-center">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mt-2 flex justify-center">
              Are you sure you want to delete this job application? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3 mt-4 ">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobCard;
