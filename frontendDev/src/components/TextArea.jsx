import React from "react";

function Textarea({ label, error, ...props }) {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-1 font-medium text-gray-700">{label}</label>}
      <textarea
        className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        {...props}
      />
      {error && <span className="text-red-600 text-sm mt-1">{error}</span>}
    </div>
  );
}

export default Textarea;
