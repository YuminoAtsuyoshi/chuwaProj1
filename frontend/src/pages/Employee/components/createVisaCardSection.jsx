// Helper function to create visa card section JSX
import { FileTextIcon, ClockIcon, CheckCircleIcon, XCircleIcon, DownloadIcon } from "./VisaCardIcons";

export const createVisaCardJSX = ({
  documentName,
  stageStatus,
  currentFeedback,
  uploadedAt,
  statusMessage,
  canUpload,
  uploading,
  FileUploadComponent,
  uploadedDocId,
  handleDocumentPreview,
  handleDocumentDownload,
  templateButtons,
  children,
}) => {
  const getStatusBadge = () => {
    if (!stageStatus) {
      return <span className="badge badge-not-started">Not Started</span>;
    }
    if (stageStatus === "pending") {
      return <span className="badge badge-pending"><ClockIcon className="badge-icon" />Pending</span>;
    }
    if (stageStatus === "approved") {
      return <span className="badge badge-approved"><CheckCircleIcon className="badge-icon" />Approved</span>;
    }
    if (stageStatus === "rejected") {
      return <span className="badge badge-rejected"><XCircleIcon className="badge-icon" />Rejected</span>;
    }
    return null;
  };

  const getStatusMessage = () => {
    if (!stageStatus) return null;
    if (stageStatus === "pending") {
      return { type: "info", message: statusMessage?.pending || `Waiting for HR to approve your ${documentName}.`, icon: ClockIcon };
    }
    if (stageStatus === "approved") {
      return { type: "success", message: statusMessage?.approved || `Please proceed with the next step.`, icon: CheckCircleIcon };
    }
    if (stageStatus === "rejected") {
      return { type: "error", message: `Rejected: ${currentFeedback || "Please review and resubmit."}`, icon: XCircleIcon };
    }
    return null;
  };

  const statusMsg = getStatusMessage();

  return (
    <div className="visa-card">
      <div className="card-header">
        <div className="card-header-content">
          <FileTextIcon />
          <div className="card-title-section">
            <h3 className="card-title">{documentName}</h3>
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

        {templateButtons && (
          <div className="template-buttons">
            {templateButtons}
          </div>
        )}

        {canUpload && FileUploadComponent && (
          <div className="card-actions">
            {FileUploadComponent}
          </div>
        )}

        {uploadedDocId && (
          <div className="document-actions">
            <button onClick={handleDocumentPreview} className="preview-btn" disabled={uploading}>
              Preview
            </button>
            <button onClick={handleDocumentDownload} className="download-btn" disabled={uploading}>
              <DownloadIcon /> Download
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};


