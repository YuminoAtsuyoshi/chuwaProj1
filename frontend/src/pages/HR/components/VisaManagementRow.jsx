import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOpts } from "../../../api/auth";
import { useDocActions } from "../hooks/useDocActions";
import NextStepsCell from "./NextStepsCell";

const VisaManagementRow = ({
  getFullName,
  getWorkAuthTitle,
  getStartAndEndDate,
  getDaysBetween,
  data,
  showApprovedDocsOnly = false,
  renderAsCard = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const { preview: handleDocumentPreview, download: handleDocumentDownload } =
    useDocActions(setMessage);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getOpts({ employee_id: data._id });
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
      console.error("Error fetching data:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  // Determine if a document is approved
  const isDocumentApproved = (docType, currentStage, currentStatus) => {
    if (!showApprovedDocsOnly) return true; // For In Progress section, use existing logic

    // Define stage order
    const stageOrder = ["onboarding", "OPT Receipt", "OPT EAD", "I-983", "I-20"];
    const currentStageIndex = stageOrder.indexOf(currentStage);
    const docStageIndex = stageOrder.indexOf(docType);

    // Handle invalid stage indices
    if (currentStageIndex === -1 || docStageIndex === -1) {
      // If we can't determine stage order, only show if status is approved
      return currentStatus === "approved";
    }

    // If document stage is before current stage, it's approved (stage was advanced)
    if (docStageIndex < currentStageIndex) return true;

    // If document stage is current stage and status is approved, it's approved
    if (docStageIndex === currentStageIndex && currentStatus === "approved")
      return true;

    // Otherwise, document is not yet approved
    return false;
  };

  // Filter approved documents for All section
  const approvedDocuments = showApprovedDocsOnly
    ? documents.filter((doc) => {
        if (!doc.doc) return false;
        return isDocumentApproved(doc.type, data.stage, data.status);
      })
    : documents;

  if (loading) {
    return renderAsCard ? <div className="hr-visa-card">Loading...</div> : "";
  }

  // Card mode for All section
  if (renderAsCard && showApprovedDocsOnly) {
    const daysRemaining = getDaysBetween(data);
    const workAuthDates = getStartAndEndDate(data);
    const daysValue = daysRemaining ? daysRemaining.replace(" days remaining", "").replace(" day remaining", "").replace("Work visa expired", "0") : "";
    const daysNum = parseInt(daysValue) || 0;
    const badgeVariant = daysNum < 60 ? "destructive" : daysNum < 120 ? "secondary" : "outline";

    return (
      <div className="hr-visa-card">
        <div className="hr-card-grid">
          <div className="hr-card-field">
            <span className="hr-card-label">Name</span>
            <div className="hr-card-value">
              {getFullName(data)}
              {data.personInfo?.preferredName && (
                <span className="hr-card-value muted"> ({data.personInfo.preferredName})</span>
              )}
            </div>
          </div>
          
          <div className="hr-card-field">
            <span className="hr-card-label">Work Authorization</span>
            <div className="hr-card-value">
              {getWorkAuthTitle(data)}
              {workAuthDates && (
                <div className="hr-card-value muted">{workAuthDates}</div>
              )}
              {daysRemaining && (
                <span className={`badge badge-${badgeVariant} ${daysNum < 60 ? "badge-rejected" : daysNum < 120 ? "badge-pending" : "badge-approved"}`} style={{ marginTop: "8px", display: "inline-block" }}>
                  {daysRemaining}
                </span>
              )}
            </div>
          </div>
          
          <div className="hr-card-field">
            <span className="hr-card-label">Next Steps</span>
            <div className="hr-card-value">
              <NextStepsCell employee={data} />
            </div>
          </div>
        </div>
        
        {/* Approved Documents */}
        <div style={{ marginTop: "20px" }}>
          <span className="hr-card-label">Approved Documents</span>
          {approvedDocuments.length > 0 ? (
            <div className="approved-docs-list">
              {approvedDocuments.map((doc) => (
                <div key={doc._id || `${doc.type}-${doc.doc}`} className="approved-doc-item">
                  <div>
                    <span className="approved-doc-name">{doc.type}</span>
                    {doc.createdAt && (
                      <span className="approved-doc-date">
                        Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDocumentPreview(doc.doc)}
                    className="preview-btn-approved"
                  >
                    Preview
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ marginTop: "12px", color: "#666", fontStyle: "italic" }}>
              No approved documents
            </div>
          )}
        </div>
      </div>
    );
  }

  // Table row mode (default)
  return (
    <tr key={data._id}>
      <td>{getFullName(data)}</td>
      <td>
        {getWorkAuthTitle(data)}
        {getStartAndEndDate(data) && (
          <>
        <br />
        {getStartAndEndDate(data)}
          </>
        )}
        {getDaysBetween(data) && (
          <>
        <br />
        {getDaysBetween(data)}
          </>
        )}
      </td>
      <td>
        <NextStepsCell employee={data} />
      </td>
      <td>
        {showApprovedDocsOnly ? (
        <div className="document-list">
            {approvedDocuments.length > 0 ? (
              approvedDocuments.map((doc) => (
                <div
                  key={doc._id || `${doc.type}-${doc.doc}`}
                  className="document-item"
                >
                  <div className="document-info">
                    <span className="document-name">{doc.type}</span>
                    <span className="document-type">PDF</span>
                  </div>
                  <div className="document-actions">
                    <button
                      onClick={() => handleDocumentPreview(doc.doc)}
                      className="preview-btn"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() =>
                        handleDocumentDownload(
                          doc.doc,
                          `${data.username}-${doc.type}`
                        )
                      }
                      className="download-btn"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <span className="no-document">No approved documents</span>
            )}
          </div>
        ) : (
          <>
            {data.status === "pending" || data.status === "rejected" ? (
              <div className="document-list">
                {documents
                  .filter((doc) => doc.type === data.stage && doc.doc)
                  .map((doc) => (
                    <div
                      key={doc._id || `${doc.type}-${doc.doc}`}
                      className="document-item"
                    >
                      <div className="document-info">
                        <span className="document-name">{doc.type}</span>
                        <span className="document-type">PDF</span>
                      </div>
                      <div className="document-actions">
                        <button
                          onClick={() => handleDocumentPreview(doc.doc)}
                          className="preview-btn"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() =>
                            handleDocumentDownload(
                              doc.doc,
                              `${data.username}-${doc.type}`
                            )
                          }
                          className="download-btn"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                {documents.filter((doc) => doc.type === data.stage && doc.doc)
                  .length === 0 && (
                  <span className="no-document">
                    No document uploaded for {data.stage}
                  </span>
                )}
              </div>
            ) : (
              <div className="document-list">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <div
                      key={doc._id || `${doc.type}-${doc.doc}`}
                      className="document-item"
                    >
                      <div className="document-info">
                        <span className="document-name">{doc.type}</span>
                        <span className="document-type">PDF</span>
                      </div>
                      <div className="document-actions">
                        <button
                          onClick={() => handleDocumentPreview(doc.doc)}
                          className="preview-btn"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() =>
                            handleDocumentDownload(
                              doc.doc,
                              `${data.username}-${doc.type}`
                            )
                          }
                          className="download-btn"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="no-document">No documents</span>
                )}
              </div>
            )}
          </>
        )}
      </td>
    </tr>
  );
};

export default VisaManagementRow;
