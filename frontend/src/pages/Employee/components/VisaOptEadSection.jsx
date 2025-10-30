import React, { useState, useEffect } from "react";
import FileUpload from "../../../components/FileUpload";

const VisaOptEadSection = ({ stage, status, feedback }) => {
  const [notices, setNotices] = useState("");

  if (
    stage === "onboarding" ||
    (stage === "OPT Receipt" && status !== "approved")
  ) {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>OPT EAD</h3>
        </div>
        <div className="section-content">
          <div className={"pending-message"}>
            Please wait until your OPT receipt application is approved.
          </div>
        </div>
      </div>
    );
  }
  if (stage === "OPT Receipt" && status === "approved") {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>OPT EAD</h3>
        </div>
        <div className="section-content">
          <div className={"pending-message"}>Please upload you file.</div>
        </div>
        <FileUpload
          label="OPT EAD"
          name="OptEad"
          accept=".pdf"
          fileType="OptEad"
          onUploadSuccess={async (docId, docUrl) => {
            const data = await createOpt({
              type: "OPT EAD",
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
  if (stage === "OPT EAD" && status === "pending") {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>
            OPT EAD
            <span className={`info-value status-badge status-pending`}>
              Pending
            </span>
          </h3>
        </div>
        <div className="section-content">
          <div className="pending-message">
            Waiting for HR to approve your OPT EAD.
          </div>
        </div>
      </div>
    );
  }
  if (stage === "OPT EAD" && status === "rejected") {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>
            OPT EAD
            <span className={`info-value status-badge status-rejected`}>
              Rejected
            </span>
          </h3>
        </div>
        <div className="section-content">
          <div className="message error">
            Your OPT EAD is rejected. Please upload again.
            <br />
            Feekback: {feedback}
          </div>
          <FileUpload
            label="OPT EAD"
            name="OptEad"
            accept=".pdf"
            fileType="OptEad"
            onUploadSuccess={async (docId, docUrl) => {
              const data = await createOpt({
                type: "OPT EAD",
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
  if (
    stage === "I-983" ||
    stage === "I-20" ||
    (stage === "OPT EAD" && status === "approved")
  ) {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>
            OPT EAD
            <span className={`info-value status-badge status-approved`}>
              Approved
            </span>
          </h3>
        </div>
        <div className="section-content">
          <div className="message success">
            Please download and fill out the I-983 form.
          </div>
        </div>
      </div>
    );
  }
};

export default VisaOptEadSection;
