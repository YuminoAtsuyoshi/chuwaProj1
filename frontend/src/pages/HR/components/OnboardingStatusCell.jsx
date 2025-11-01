import React from "react";

/**
 * Component to display Onboarding Application status and feedback
 * Shows "Approved" or "Rejected" with HR feedback if rejected
 */
const OnboardingStatusCell = ({ employee }) => {
  // Only show if employee has submitted onboarding application
  if (!employee.personInfo) {
    return <span style={{ color: "#666", fontStyle: "italic" }}>Not submitted</span>;
  }

  // Check if onboarding stage has been processed (approved or rejected)
  // For employees at onboarding stage or beyond, we show the status
  if (employee.stage === "onboarding") {
    // Still at onboarding stage
    if (employee.status === "approved") {
      return (
        <div>
          <span className="status-badge status-approved">Approved</span>
        </div>
      );
    } else if (employee.status === "rejected") {
      return (
        <div>
          <span className="status-badge status-rejected">Rejected</span>
          {employee.feedback && (
            <div style={{ marginTop: "8px", fontSize: "0.875rem", color: "#666", lineHeight: "1.4" }}>
              <strong>Feedback:</strong> {employee.feedback}
            </div>
          )}
        </div>
      );
    } else if (employee.status === "pending") {
      return (
        <div>
          <span className="status-badge status-pending">Pending Review</span>
        </div>
      );
    } else {
      return (
        <div>
          <span style={{ color: "#666", fontStyle: "italic" }}>Not submitted</span>
        </div>
      );
    }
  } else {
    // Employee has moved beyond onboarding stage
    // This means onboarding was approved (otherwise they wouldn't have progressed)
    return (
      <div>
        <span className="status-badge status-approved">Approved</span>
      </div>
    );
  }
};

export default OnboardingStatusCell;

