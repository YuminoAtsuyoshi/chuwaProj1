import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  approveEmployeeApplication,
  rejectEmployeeApplication,
} from "../../api/auth";
import { useDocActions } from "./hooks/useDocActions";
import ReviewActions from "./components/ReviewActions";
import { useHRReview } from "./hooks/useHRReview";
import ReviewFormReadonly from "./components/ReviewFormReadonly";
import DocsList from "./components/DocsList";
import "./HROnboardingReviewPage.css";

const HROnboardingReviewPage = () => {
  const {
    employee,
    employeeInfo,
    loading,
    message,
    setMessage,
    isPending,
    isRejected,
    isApproved,
  } = useHRReview();
  const [processing, setProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const navigate = useNavigate();

  const handleApprove = async () => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this application?"
    );
    if (!confirmApprove) return;

    setProcessing(true);
    setMessage("");

    try {
      const testUser = localStorage.getItem("testUser");
      if (testUser) {
        // Mock success for testing
        setEmployee((prev) => ({ ...prev, status: "approved" }));
        setMessage("Application approved successfully!");
      } else {
        await approveEmployeeApplication(employeeId);
        setEmployee((prev) => ({ ...prev, status: "approved" }));
        setMessage("Application approved successfully!");
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`Failed to approve application: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectFeedback.trim()) {
      setMessage("Please provide feedback for rejection");
      return;
    }

    setProcessing(true);
    setMessage("");

    try {
      const testUser = localStorage.getItem("testUser");
      if (testUser) {
        // Mock success for testing
        setEmployee((prev) => ({
          ...prev,
          status: "rejected",
          feedback: rejectFeedback,
        }));
        setMessage("Application rejected successfully!");
        setShowRejectModal(false);
        setRejectFeedback("");
      } else {
        await rejectEmployeeApplication(employeeId, rejectFeedback);
        setEmployee((prev) => ({
          ...prev,
          status: "rejected",
          feedback: rejectFeedback,
        }));
        setMessage("Application rejected successfully!");
        setShowRejectModal(false);
        setRejectFeedback("");
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`Failed to reject application: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const { preview: handleDocumentPreview, download: handleDocumentDownload } =
    useDocActions(setMessage);

  const getWorkAuthTitle = () => {
    if (!employeeInfo) return "N/A";

    if (employeeInfo.is_pr_or_citizen === "yes") {
      return employeeInfo.pr_or_citizen_type || "Citizen/Permanent Resident";
    } else if (employeeInfo.is_pr_or_citizen === "no") {
      return employeeInfo.work_auth_type || "N/A";
    }

    return "N/A";
  };

  if (loading) {
    return (
      <div className="hr-review-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!employee || !employeeInfo) {
    return (
      <div className="hr-review-container">
        <div className="no-data">
          <h2>Application Not Found</h2>
          <p>No application found for this employee.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hr-review-container">
      <div className="review-header">
        <div className="header-content">
          <button
            onClick={() => navigate("/hr/hiring-management")}
            className="back-btn"
          >
            ← Back to Hiring Management
          </button>
          <h1>Review Onboarding Application</h1>
          <div className="status-badge-container">
            <span className={`status-badge status-${employee.status}`}>
              {employee.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`message ${
            message.includes("successfully") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      {/* Application Status Alert */}
      {isPending && (
        <div className="status-alert pending-alert">
          <h3>📋 Pending Review</h3>
          <p>
            This application is waiting for your review. Please examine all
            details before making a decision.
          </p>
        </div>
      )}

      {isRejected && employee.feedback && (
        <div className="status-alert rejected-alert">
          <h3>❌ Previously Rejected</h3>
          <p>
            <strong>Rejection Feedback:</strong> {employee.feedback}
          </p>
        </div>
      )}

      {isApproved && (
        <div className="status-alert approved-alert">
          <h3>✅ Approved</h3>
          <p>This application has been approved.</p>
        </div>
      )}

      {/* 只读表单 */}
      <ReviewFormReadonly
        employeeInfo={employeeInfo}
        getWorkAuthTitle={getWorkAuthTitle}
      />
      {/* 文档列表 */}
      <DocsList
        employeeInfo={employeeInfo}
        onPreview={handleDocumentPreview}
        onDownload={handleDocumentDownload}
      />

      <ReviewActions
        isPending={isPending}
        processing={processing}
        onApprove={handleApprove}
        onOpenReject={() => setShowRejectModal(true)}
        showRejectModal={showRejectModal}
        rejectFeedback={rejectFeedback}
        setRejectFeedback={setRejectFeedback}
        onReject={handleReject}
        onCloseReject={() => {
          setShowRejectModal(false);
          setRejectFeedback("");
        }}
      />
    </div>
  );
};

export default HROnboardingReviewPage;
