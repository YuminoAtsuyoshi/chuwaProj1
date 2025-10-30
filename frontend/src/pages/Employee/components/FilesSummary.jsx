import React from 'react';

const FilesSummary = ({ uploadedFiles, onPreview, onDownload }) => {
  return (
    <div className="form-section">
      <h3>Uploaded Documents</h3>
      <div className="document-list">
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

        {uploadedFiles.optReceiptDocId && (
          <div className="document-item">
            <div className="document-info">
              <span className="document-name">OPT Receipt</span>
              <span className="document-type">Work Authorization</span>
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

        {!uploadedFiles.profilePictureDocId && !uploadedFiles.driverLicenseDocId && !uploadedFiles.optReceiptDocId && (
          <div className="no-documents">
            <p>No documents uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesSummary;


