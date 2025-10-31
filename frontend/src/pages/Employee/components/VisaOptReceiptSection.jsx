import React from "react";

// Employee-side section for the OPT Receipt step
// Props: stage, status, feedback
const VisaOptReceiptSection = ({ stage, status, feedback }) => {
  const isActiveStage = stage === "OPT Receipt";

  return (
    <div className="info-section">
      <div className="section-header">
        <h3>OPT Receipt</h3>
      </div>

      {!isActiveStage ? (
        <div className="no-data">
          <h2>Not available for your current stage</h2>
          <p>This section will appear when you enter the OPT Receipt stage.</p>
        </div>
      ) : (
        <div className="readonly-fields">
          <div className="field">
            <label>Status</label>
            <span className={`status-badge status-${status || "unknown"}`}>
              {(status || "N/A").toUpperCase()}
            </span>
          </div>
          {feedback && (
            <div className="field">
              <label>Feedback</label>
              <span>{feedback}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VisaOptReceiptSection;


