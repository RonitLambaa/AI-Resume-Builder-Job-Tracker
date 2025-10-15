import React, { useEffect, useState } from "react";
import { JOB_STAGES } from "./constants";

function JobProgressBar({ status }) {
  const [finalLabel, setFinalLabel] = useState(null);

  useEffect(() => {
    if (status === "offer") {
      setFinalLabel("OFFER 🎉");
    } else if (status === "rejected") {
      setFinalLabel("REJECTED ❌");
    } else {
      setFinalLabel(null);
    }
  }, [status]);

  // Map schema status → JOB_STAGES stage
  const stageKey =
    status === "offer" || status === "rejected" ? "offer/rejected" : status;

  const currentIndex = JOB_STAGES.indexOf(stageKey) + 1;
  const totalStages = JOB_STAGES.length;
  const percentage = (currentIndex / totalStages) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2 text-sm font-medium text-gray-700">
        {finalLabel ? (
          <span
            className={`${
              status === "offer" ? "text-green-500" : "text-red-500"
            }`}
          >
            {finalLabel}
          </span>
        ) : (
          JOB_STAGES.map((stage, idx) => (
            <span
              key={idx}
              className={idx < currentIndex ? "text-blue-600" : ""}
            >
              {stage.toUpperCase()}
            </span>
          ))
        )}
      </div>

      <div className="w-full bg-gray-200 h-3 rounded-full">
        <div
          className={`h-3 rounded-full ${
            status === "rejected"
              ? "bg-red-500"
              : status === "offer"
              ? "bg-green-500"
              : "bg-blue-600"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default JobProgressBar;
