import React from "react";

// Employee-side section for the I-983 Training Plan step
// Props: stage, status, feedback
const VisaI983FormSection = ({ stage, status, feedback }) => {
  const isActiveStage = stage === "I-983";

  return (
    <div className="info-section">
      <div className="section-header">
        <h3>I-983 Training Plan</h3>
      </div>

      {!isActiveStage ? (
        <div className="no-data">
          <h2>Not available for your current stage</h2>
          <p>This section will appear when you enter the I-983 stage.</p>
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

export default VisaI983FormSection;


