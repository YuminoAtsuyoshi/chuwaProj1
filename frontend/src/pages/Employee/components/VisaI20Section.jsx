import React, { useState, useEffect } from "react";
import FileUpload from "../../../components/FileUpload";

const VisaI20Section = ({ stage, status, feedback }) => {
  const [notices, setNotices] = useState("");

  if (
    stage === "onboarding" ||
    stage === "OPT Receipt" ||
    stage === "OPT EAD" ||
    (stage === "I-983" && status !== "approved")
  ) {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>I-20</h3>
        </div>
        <div className="section-content">
          <div className={"pending-message"}>
            Please wait until your I-983 application is approved.
          </div>
        </div>
      </div>
    );
  }
  if (stage === "I-983" && status === "approved") {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>I-20</h3>
        </div>
        <div className="section-content">
          <div className={"pending-message"}>Please upload you file.</div>
        </div>
        <FileUpload
          label="I-20"
          name="I20"
          accept=".pdf"
          fileType="I20"
          onUploadSuccess={async (docId, docUrl) => {
            const data = await createOpt({
              type: "I-20",
              doc: docId,
              employeeId: user._id,
            });
            setNotices("Submit successfully");
          }}
          onUploadError={(error) => setNotices(error)}
          className={notices ? "error" : ""}
        />
        {notices && <span>{notices}</span>}
      </div>
    );
  }
  if (stage === "I-20" && status === "pending") {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>
            I-20
            <span className={`info-value status-badge status-pending`}>
              Pending
            </span>
          </h3>
        </div>
        <div className="section-content">
          <div className="pending-message">
            Waiting for HR to approve your I-20.
          </div>
        </div>
      </div>
    );
  }
  if (stage === "I-20" && status === "rejected") {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>
            I-20
            <span className={`info-value status-badge status-rejected`}>
              Rejected
            </span>
          </h3>
        </div>
        <div className="section-content">
          <div className="message error">
            Your I-20 is rejected. Please upload again.
            <br />
            Feekback: {feedback}
          </div>
          <FileUpload
            label="I-20"
            name="I20"
            accept=".pdf"
            fileType="I20"
            onUploadSuccess={async (docId, docUrl) => {
              const data = await createOpt({
                type: "I-20",
                doc: docId,
                employeeId: user._id,
              });
              setNotices("Submit successfully");
            }}
            onUploadError={(error) => setNotices(error)}
            className={notices ? "error" : ""}
          />
          {notices && <span>{notices}</span>}
        </div>
      </div>
    );
  }
  if (stage === "I-20" && status === "approved") {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>
            I-20
            <span className={`info-value status-badge status-approved`}>
              Approved
            </span>
          </h3>
        </div>
        <div className="section-content">
          <div className="message success">
            All documents have been approved.
          </div>
        </div>
      </div>
    );
  }
};

export default VisaI20Section;
