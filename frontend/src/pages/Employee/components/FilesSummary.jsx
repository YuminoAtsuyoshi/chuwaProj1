import React from 'react';

const FilesSummary = ({ uploadedFiles, formData, onPreview, onDownload }) => {
  // Only count work auth documents if user is not a citizen/PR
  const hasAnyDocument =
    uploadedFiles.profilePictureDocId ||
    uploadedFiles.driverLicenseDocId ||
    (formData?.isPrOrCitizen === "no" && uploadedFiles.workAuthDocId) ||
    (formData?.isPrOrCitizen === "no" && uploadedFiles.optReceiptDocId);

  return (
    <div className="form-section">
      <h3>Summary of Uploaded Files or Documents</h3>
      <div className="document-list">
        {/* Profile Picture */}
        {uploadedFiles.profilePictureDocId && (
          <div className="document-item">
            <div className="document-info">
              <span className="document-name">Profile Picture</span>
              <span className="document-type">Image</span>
            </div>
            <div className="document-actions">
              <button 
                onClick={() => onPreview(uploadedFiles.profilePictureDocId)}
                className="preview-btn"
              >
                Preview
              </button>
              <button 
                onClick={() => onDownload(uploadedFiles.profilePictureDocId, 'profile-picture')}
                className="download-btn"
              >
                Download
              </button>
            </div>
          </div>
        )}

        {/* Driver's License */}
        {uploadedFiles.driverLicenseDocId && (
          <div className="document-item">
            <div className="document-info">
              <span className="document-name">Driver's License</span>
              <span className="document-type">Document</span>
            </div>
            <div className="document-actions">
              <button 
                onClick={() => onPreview(uploadedFiles.driverLicenseDocId)}
                className="preview-btn"
              >
                Preview
              </button>
              <button 
                onClick={() => onDownload(uploadedFiles.driverLicenseDocId, 'drivers-license')}
                className="download-btn"
              >
                Download
              </button>
            </div>
          </div>
        )}

        {/* Work Authorization Document - Only show if not a citizen/PR */}
        {uploadedFiles.workAuthDocId && formData?.isPrOrCitizen === "no" && (
          <div className="document-item">
            <div className="document-info">
              <span className="document-name">Work Authorization</span>
              <span className="document-type">Document</span>
            </div>
            <div className="document-actions">
              <button 
                onClick={() => onPreview(uploadedFiles.workAuthDocId)}
                className="preview-btn"
              >
                Preview
              </button>
              <button 
                onClick={() => onDownload(uploadedFiles.workAuthDocId, 'work-authorization')}
                className="download-btn"
              >
                Download
              </button>
            </div>
          </div>
        )}

        {/* OPT Receipt (Only for F1 OPT and not a citizen/PR) */}
        {uploadedFiles.optReceiptDocId && formData?.isPrOrCitizen === "no" && (
          <div className="document-item">
            <div className="document-info">
              <span className="document-name">OPT Receipt</span>
              <span className="document-type">Document</span>
            </div>
            <div className="document-actions">
              <button 
                onClick={() => onPreview(uploadedFiles.optReceiptDocId)}
                className="preview-btn"
              >
                Preview
              </button>
              <button 
                onClick={() => onDownload(uploadedFiles.optReceiptDocId, 'opt-receipt')}
                className="download-btn"
              >
                Download
              </button>
            </div>
          </div>
        )}

        {!hasAnyDocument && (
          <div className="no-documents">
            <p>No documents uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesSummary;


