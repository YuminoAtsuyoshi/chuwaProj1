import React from "react";

const DocsList = ({ employeeInfo, onPreview, onDownload }) => {
  return (
    <div className="review-section">
      <h2>Uploaded Documents</h2>
      <div className="document-list">
        {employeeInfo.profilePicture && (
          <div className="document-item">
            <div className="document-info">
              <span className="document-name">Profile Picture</span>
              <span className="document-type">Image</span>
            </div>
            <div className="document-actions">
              <button
                onClick={() => onPreview(employeeInfo.profilePicture)}
                className="preview-btn"
              >
                Preview
              </button>
              <button
                onClick={() =>
                  onDownload(employeeInfo.profilePicture, "profile-picture")
                }
                className="download-btn"
              >
                Download
              </button>
            </div>
          </div>
        )}

        {employeeInfo.driverLicense && (
          <div className="document-item">
            <div className="document-info">
              <span className="document-name">Driver's License</span>
              <span className="document-type">Document</span>
            </div>
            <div className="document-actions">
              <button
                onClick={() => onPreview(employeeInfo.driverLicense)}
                className="preview-btn"
              >
                Preview
              </button>
              <button
                onClick={() =>
                  onDownload(employeeInfo.driverLicense, "drivers-license")
                }
                className="download-btn"
              >
                Download
              </button>
            </div>
          </div>
        )}

        {employeeInfo.workAuthDoc && (
          <div className="document-item">
            <div className="document-info">
              <span className="document-name">Work Authorization</span>
              <span className="document-type">Document</span>
            </div>
            <div className="document-actions">
              <button
                onClick={() => onPreview(employeeInfo.workAuthDoc)}
                className="preview-btn"
              >
                Preview
              </button>
              <button
                onClick={() =>
                  onDownload(employeeInfo.workAuthDoc, "work-auth")
                }
                className="download-btn"
              >
                Download
              </button>
            </div>
          </div>
        )}

        {(employeeInfo.optReceipt || employeeInfo.optReceiptUpload) && (
          <div className="document-item">
            <div className="document-info">
              <span className="document-name">OPT Receipt</span>
              <span className="document-type">Work Authorization</span>
            </div>
            <div className="document-actions">
              <button
                onClick={() => onPreview(employeeInfo.optReceipt || employeeInfo.optReceiptUpload)}
                className="preview-btn"
              >
                Preview
              </button>
              <button
                onClick={() =>
                  onDownload((employeeInfo.optReceipt || employeeInfo.optReceiptUpload), "opt-receipt")
                }
                className="download-btn"
              >
                Download
              </button>
            </div>
          </div>
        )}

        {!employeeInfo.profilePicture &&
          !employeeInfo.driverLicense &&
          !employeeInfo.workAuthDoc &&
          !(employeeInfo.optReceipt || employeeInfo.optReceiptUpload) && (
            <div className="no-documents">
              <p>No documents uploaded.</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default DocsList;
