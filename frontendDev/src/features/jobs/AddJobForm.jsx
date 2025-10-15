import React, { useState } from "react";

function AddJobForm({ onSubmit, onCancel, resumes = [] }) {
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("applied");
  const [appliedDate, setAppliedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [resumeUsed, setResumeUsed] = useState("");

  const stages = ["applied", "interview", "offer", "rejected"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role || !company) return;

    onSubmit({
      role,
      company,
      location,
      status,
      appliedDate: appliedDate || undefined,
      notes,
      resumeUsed: resumeUsed || null, // optional
    });

    // reset
    setRole("");
    setCompany("");
    setLocation("");
    setStatus("applied");
    setAppliedDate("");
    setNotes("");
    setResumeUsed("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-6 rounded-xl shadow flex flex-col gap-4 border border-gray-200 mb-6"
    >
      <h2 className="text-xl font-bold">Add New Job</h2>

      {/* Role & Company */}
      <input
        type="text"
        placeholder="Job Title"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border px-3 py-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="border px-3 py-2 rounded"
        required
      />

      {/* Location */}
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border px-3 py-2 rounded"
      />

      {/* Status */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border px-3 py-2 rounded cursor-pointer"
      >
        {stages.map((stage) => (
          <option key={stage} value={stage}>
            {stage}
          </option>
        ))}
      </select>

      {/* Applied Date */}
      <input
        type="date"
        value={appliedDate}
        onChange={(e) => setAppliedDate(e.target.value)}
        className="border px-3 py-2 rounded cursor-pointer"
      />

      {/* Resume selection */}
      <select
        value={resumeUsed}
        onChange={(e) => setResumeUsed(e.target.value)}
        className="border px-3 py-2 rounded cursor-pointer"
      >
        <option value="">Select Resume (Optional)</option>
        {resumes.map((resume) => (
          <option key={resume._id} value={resume._id}>
            {resume.title}
          </option>
        ))}
      </select>

      {/* Notes */}
      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border px-3 py-2 rounded "
      />

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
        >
          Add Job
        </button>
      </div>
    </form>
  );
}

export default AddJobForm;
