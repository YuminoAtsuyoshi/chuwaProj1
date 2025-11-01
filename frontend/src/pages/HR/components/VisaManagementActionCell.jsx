import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOpts } from "../../../api/auth";
import {
  approveEmployeeApplication,
  rejectEmployeeApplication,
  sendNotification,
} from "../../../api/auth";
import { useDocActions } from "../hooks/useDocActions";

const VisaManagementActionCell = ({ employee, onUpdate, setMessage }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [pendingDocumentType, setPendingDocumentType] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const { preview: handleDocumentPreview, download: handleDocumentDownload } =
    useDocActions(setMessage || (() => {}));

  // Fetch documents for this employee
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const result = await getOpts({ employee_id: employee._id });
        // Keep only the most relevant document of each type
        // Priority: pending > approved > rejected, then latest by date
        const docsByType = {};
        result.forEach((doc) => {
          const existing = docsByType[doc.type];
          if (!existing) {
            docsByType[doc.type] = doc;
          } else {
            const statusPriority = { pending: 3, approved: 2, rejected: 1 };
            const docPriority = statusPriority[doc.status] || 0;
            const existingPriority = statusPriority[existing.status] || 0;
            if (docPriority > existingPriority || 
                (docPriority === existingPriority && new Date(doc.createdAt) > new Date(existing.createdAt))) {
              docsByType[doc.type] = doc;
            }
          }
        });
        const uniqueDocs = Object.values(docsByType);
        setDocuments(uniqueDocs);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [employee._id, employee.stage, employee.status]);

  const handleViewApplication = (employeeId) => {
    const url = `/hr/review-onboarding/${employeeId}`;
    window.open(url, "_blank");
  };

  const handleApprove = async () => {
    try {
      // Determine which document type to approve based on context
      let documentType = null;
      
      if (employee.status === "pending" || employee.status === "rejected") {
        // Approving a document for the current stage
        if (employee.stage !== "onboarding") {
          documentType = employee.stage;
        }
      } else if (employee.status === "approved") {
        // Approving a document for the next stage
        // documentType is determined by the button context (from nextStageDocument)
        // We'll pass this from the button click
      }
      
      await approveEmployeeApplication(employee._id, documentType);
      if (onUpdate) {
        onUpdate();
      } else {
        navigate(0);
      }
    } catch (error) {
      if (setMessage) {
        setMessage(`Failed to approve: ${error.message || "Unknown error"}`);
      }
    }
  };

  const handleReject = () => {
    setPendingDocumentType(null); // null means onboarding level
    setShowRejectModal(true);
  };

  const handleApproveWithType = async (documentType) => {
    try {
      await approveEmployeeApplication(employee._id, documentType);
      if (onUpdate) {
        onUpdate();
      } else {
        navigate(0);
      }
    } catch (error) {
      if (setMessage) {
        setMessage(`Failed to approve: ${error.message || "Unknown error"}`);
      }
    }
  };

  const handleRejectWithType = (documentType) => {
    setPendingDocumentType(documentType);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectFeedback.trim()) {
      setMessage("Please provide feedback for rejection");
      return;
    }

    setProcessing(true);
    try {
      await rejectEmployeeApplication(employee._id, rejectFeedback, pendingDocumentType);
      if (onUpdate) {
        onUpdate();
      } else {
        navigate(0);
      }
      setShowRejectModal(false);
      setRejectFeedback("");
      setPendingDocumentType(null);
      if (setMessage) {
        setMessage("Document rejected successfully!");
      }
    } catch (error) {
      if (setMessage) {
        setMessage(`Failed to reject: ${error.message || "Unknown error"}`);
      }
    } finally {
      setProcessing(false);
    }
  };

  const closeRejectModal = () => {
    if (!processing) {
      setShowRejectModal(false);
      setRejectFeedback("");
      setPendingDocumentType(null);
    }
  };

  const handleSendNotification = async (oldStage, newStage) => {
    try {
      await sendNotification(employee.email, oldStage, newStage);
      if (setMessage) {
        setMessage("Notification sent successfully!");
      }
    } catch (error) {
      if (setMessage) {
        setMessage(`Failed to send notification: ${error.message || "Unknown error"}`);
      }
    }
  };

  if (loading) {
    return <span>Loading...</span>;
  }

  // Helper function to render the modal
  const renderRejectModal = () => {
    if (!showRejectModal) return null;
    
    return (
      <div className="modal-overlay" onClick={closeRejectModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>Reject {pendingDocumentType ? `${pendingDocumentType} Document` : "Application"}</h3>
          <div className="modal-body">
            <label htmlFor="feedback">Please provide feedback for rejection:</label>
            <textarea
              id="feedback"
              value={rejectFeedback}
              onChange={(e) => setRejectFeedback(e.target.value)}
              placeholder="Enter rejection feedback..."
              rows={5}
              disabled={processing}
            />
          </div>
          <div className="modal-footer">
            <button 
              onClick={confirmReject} 
              className="reject-btn" 
              disabled={processing || !rejectFeedback.trim()}
            >
              {processing ? 'Rejecting...' : 'Confirm Reject'}
            </button>
            <button onClick={closeRejectModal} className="cancel-btn" disabled={processing}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // never_submit status
  if (employee.status === "never_submit") {
    return (
      <>
        <button
          onClick={() => handleSendNotification("onboarding", "OPT Receipt")}
          className="view-btn"
        >
          Send Notification
        </button>
        {renderRejectModal()}
      </>
    );
  }

  // pending or rejected status
  if (employee.status === "pending" || employee.status === "rejected") {
    if (employee.stage === "onboarding") {
      return (
        <>
          <div className="action-cell-container">
            <button
              onClick={() => handleViewApplication(employee._id)}
              className="view-btn"
            >
              View Application
            </button>
            <div className="action-buttons-vertical">
              <button onClick={handleApprove} className="approve-btn-review">
                Approve
              </button>
              <button onClick={handleReject} className="reject-btn-review">
                Reject
              </button>
            </div>
          </div>
          {renderRejectModal()}
        </>
      );
    } else {
      // Find the latest pending document - this is what HR needs to review
      // Don't filter by employee.stage as the stage might not have advanced yet
      const pendingDocument = documents
        .filter((doc) => doc.status === "pending" || !doc.status) // Include documents without status (backward compat)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

      const displayDoc = pendingDocument;

      return (
        <>
          <div className="action-cell-container">
            {displayDoc ? (
              <div className="document-item-review">
                <div className="document-info-review">
                  <span className="document-name-review">{displayDoc.type}</span>
                  <span className={`document-status-badge status-${displayDoc.status || 'pending'}`}>
                    {displayDoc.status ? displayDoc.status.toUpperCase() : 'PENDING'}
                  </span>
                </div>
                <div className="document-actions-vertical">
                  <button
                    onClick={() => handleDocumentPreview(displayDoc.doc)}
                    className="preview-btn-review"
                  >
                    Preview
                  </button>
                  <button 
                    onClick={() => displayDoc ? handleApproveWithType(displayDoc.type) : handleApprove()} 
                    className="approve-btn-review"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => displayDoc ? handleRejectWithType(displayDoc.type) : handleReject()} 
                    className="reject-btn-review"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-document-message">
                No pending document to review
              </div>
            )}
          </div>
          {renderRejectModal()}
        </>
      );
    }
  }

  // approved status
  if (employee.status === "approved") {
    // Check if employee has uploaded a document for the NEXT stage
    // If so, show approve/reject buttons instead of just "Send Notification"
    let nextStageDocument = null;
    if (employee.stage === "onboarding") {
      nextStageDocument = documents.find((doc) => doc.type === "OPT Receipt");
    } else if (employee.stage === "OPT Receipt") {
      nextStageDocument = documents.find((doc) => doc.type === "OPT EAD");
    } else if (employee.stage === "OPT EAD") {
      nextStageDocument = documents.find((doc) => doc.type === "I-983");
    } else if (employee.stage === "I-983") {
      nextStageDocument = documents.find((doc) => doc.type === "I-20");
    }
    
    // If there's a document waiting for review, show approve/reject buttons
    if (nextStageDocument) {
      return (
        <>
          <div className="action-cell-container">
            <div className="document-item-review">
              <div className="document-info-review">
                <span className="document-name-review">{nextStageDocument.type}</span>
                <span className={`document-status-badge status-${nextStageDocument.status || 'pending'}`}>
                  {nextStageDocument.status ? nextStageDocument.status.toUpperCase() : 'PENDING'}
                </span>
              </div>
              <div className="document-actions-vertical">
                <button
                  onClick={() => handleDocumentPreview(nextStageDocument.doc)}
                  className="preview-btn-review"
                >
                  Preview
                </button>
                <button 
                  onClick={() => handleApproveWithType(nextStageDocument.type)} 
                  className="approve-btn-review"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleRejectWithType(nextStageDocument.type)} 
                  className="reject-btn-review"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
          {renderRejectModal()}
        </>
      );
    }
    
    // Otherwise, show "Send Notification" button to advance the stage
    let oldStage, newStage;
    if (employee.stage === "onboarding") {
      oldStage = "onboarding";
      newStage = "OPT Receipt";
    } else if (employee.stage === "OPT Receipt") {
      oldStage = "OPT Receipt";
      newStage = "OPT EAD";
    } else if (employee.stage === "OPT EAD") {
      oldStage = "OPT EAD";
      newStage = "I-983";
    } else if (employee.stage === "I-983") {
      oldStage = "I-983";
      newStage = "I-20";
    } else {
      return null;
    }

    return (
      <>
        <button
          onClick={() => handleSendNotification(oldStage, newStage)}
          className="view-btn"
        >
          Send Notification
        </button>
        {renderRejectModal()}
      </>
    );
  }

  return null;
};

export default VisaManagementActionCell;

