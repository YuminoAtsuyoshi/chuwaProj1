import React, { useState, useEffect } from "react";
import { uploadFile, getDocumentUrl, createOpt } from "../../../api/auth";
import FileUpload from "../../../components/FileUpload";
import { FileTextIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "./VisaCardIcons";

// Employee-side section for the I-20 step
// Props: currentStage, currentStatus, currentFeedback, employeeId, optDoc, prevDoc, prevDocType, onUpdate, setMessage
const VisaI20Section = ({
  currentStage,
  currentStatus,
  currentFeedback,
  employeeId,
  optDoc,
  prevDoc,
  prevDocType,
  onUpdate,
  setMessage,
}) => {
  const documentId = optDoc?.doc || null;
  const [uploading, setUploading] = useState(false);
  const [uploadedDocId, setUploadedDocId] = useState(documentId);

  // Determine if this stage is active (user is at I-20 stage)
  const isActiveStage = currentStage === "I-20";
  const isStagePassed = false; // I-20 is the last stage

  // Determine status for this specific stage
  // 1) Use optDoc.status if exists, 2) Use stage logic based on employee.stage/status
  const getStageStatus = () => {
    // If optDoc has its own status, use it
    if (optDoc?.status) {
      return optDoc.status;
    }
    // Fallback to stage-based logic
    if (isActiveStage) return currentStatus;
    if (documentId) return "pending";
    return null;
  };

  const stageStatus = getStageStatus();

  // Check if previous document (I-983) is approved
  // 1) Check if I-983 optDoc has approved status, 2) Use stage logic
  const isPrevDocApproved = 
    prevDoc?.status === "approved" ||
    currentStage === "I-20";

  // Sync uploadedDocId with optDoc
  useEffect(() => {
    if (documentId) {
      setUploadedDocId(documentId);
    }
  }, [documentId]);

  // Check if user can upload
  // If rejected, always allow re-upload. Otherwise, only if previous doc approved, no document uploaded, and not pending
  const canUpload = stageStatus === "rejected" || (isPrevDocApproved && !uploadedDocId && stageStatus !== "pending");

  const handleFileUploadSuccess = async (docId, docUrl) => {
    try {
      setUploading(true);
      // Create OPT record
      await createOpt({
        type: "I-20",
        doc: docId,
        employee_id: employeeId,
      });
      setUploadedDocId(docId);
      setMessage("I-20 uploaded successfully!");
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      setMessage(`Failed to upload I-20: ${error.message || "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUploadError = (error) => {
    setMessage(`Upload failed: ${error.message || "Unknown error"}`);
  };

  const handleDocumentDownload = async () => {
    if (!uploadedDocId) return;
    try {
      const response = await getDocumentUrl(uploadedDocId);
      const link = document.createElement("a");
      link.href = response.url;
      link.download = "I-20.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setMessage(`Download failed: ${error.message || "Unknown error"}`);
    }
  };

  const handleDocumentPreview = async () => {
    if (!uploadedDocId) return;
    try {
      const response = await getDocumentUrl(uploadedDocId);
      window.open(response.url, "_blank");
    } catch (error) {
      setMessage(`Preview failed: ${error.message || "Unknown error"}`);
    }
  };

  // Check if all documents are approved (I-20 is the last stage)
  const isAllApproved = stageStatus === "approved" && isActiveStage;

  const getStatusBadge = () => {
    if (!stageStatus) return <span className="badge badge-not-started">Not Started</span>;
    if (stageStatus === "pending") {
      return <span className="badge badge-pending"><ClockIcon /><span style={{ marginLeft: "4px" }}>Pending</span></span>;
    }
    if (stageStatus === "approved") {
      return <span className="badge badge-approved"><CheckCircleIcon /><span style={{ marginLeft: "4px" }}>Approved</span></span>;
    }
    if (stageStatus === "rejected") {
      return <span className="badge badge-rejected"><XCircleIcon /><span style={{ marginLeft: "4px" }}>Rejected</span></span>;
    }
    return null;
  };

  const getStatusMessage = () => {
    if (stageStatus === "pending") {
      return { type: "info", message: "Waiting for HR to approve your I-20.", icon: ClockIcon };
    }
    if (isAllApproved) {
      return { type: "success", message: "All documents have been approved.", icon: CheckCircleIcon };
    }
    if (stageStatus === "rejected") {
      // Use optDoc.feedback if available, otherwise currentFeedback
      const feedback = optDoc?.feedback || currentFeedback;
      return { type: "error", message: `Rejected: ${feedback || "Please review and resubmit."}`, icon: XCircleIcon };
    }
    // If not started and previous doc approved, show upload prompt
    if (!stageStatus && isPrevDocApproved) {
      return { type: "info", message: "Please upload a copy of your I-20.", icon: ClockIcon };
    }
    // If not started and previous doc not approved, show warning
    if (!stageStatus && !isPrevDocApproved) {
      return { type: "warning", message: "Please wait for I-983 to be approved first.", icon: ClockIcon };
    }
    return null;
  };

  const statusMsg = getStatusMessage();
  const uploadedAt = optDoc?.createdAt || (documentId ? "Previously uploaded" : null);

  return (
    <div className="visa-card">
      <div className="card-header">
        <div className="card-header-content">
          <FileTextIcon />
          <div className="card-title-section">
            <h3 className="card-title">I-20</h3>
            {uploadedAt && (
              <p className="card-description">
                {typeof uploadedAt === 'string' && uploadedAt.includes('T') 
                  ? `Uploaded: ${new Date(uploadedAt).toLocaleDateString()}`
                  : uploadedAt}
              </p>
            )}
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="card-content">
        {statusMsg && (
          <div className={`alert alert-${statusMsg.type}`}>
            <statusMsg.icon />
            <p className="alert-message">{statusMsg.message}</p>
        </div>
        )}

        {/* Show upload button for not_started or rejected documents */}
        {(!uploadedDocId || stageStatus === "rejected") && (
          <div className="card-actions">
            {canUpload ? (
              <FileUpload
                label="Upload I-20"
                name="i20"
                accept=".pdf,.jpg,.jpeg,.png"
                fileType="I-20"
                onUploadSuccess={(docId, docUrl) =>
                  handleFileUploadSuccess(docId, docUrl)
                }
                onUploadError={handleFileUploadError}
                required={true}
              />
            ) : (
              <button disabled className="btn btn-secondary">
                Upload I-20
              </button>
            )}
          </div>
        )}

        {/* Show download/preview for uploaded documents */}
        {uploadedDocId && (
          <div className="document-actions">
            <button onClick={handleDocumentPreview} className="preview-btn" disabled={uploading}>
              Preview
            </button>
            <button onClick={handleDocumentDownload} className="download-btn" disabled={uploading}>
              Download
            </button>
            </div>
          )}
        </div>
    </div>
  );
};

export default VisaI20Section;
