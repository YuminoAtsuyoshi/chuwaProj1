import React, { useState, useEffect } from "react";
import FileUpload from "../../../components/FileUpload";

const VisaI983Section = ({ stage, status, feedback }) => {
  const [notices, setNotices] = useState("");

  if (
    stage === "onboarding" ||
    stage === "OPT Receipt" ||
    (stage === "OPT EAD" && status !== "approved")
  ) {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>I-983</h3>
        </div>
        <div className="section-content">
          <a
            href={"https://www.ice.gov/doclib/sevis/pdf/i983.pdf"}
            download
            target="_blank"
          >
            <button>Empty Template</button>
          </a>
          <a
            href={
              "https://isss.utah.edu/forms-publications/documents/f-1/f1-form-i-983-sample.pdf"
            }
            download
            target="_blank"
          >
            <button>Sample Template</button>
          </a>
          <div className={"pending-message"}>
            Please wait until your OPT EAD application is approved.
          </div>
        </div>
      </div>
    );
  }
  if (stage === "OPT EAD" && status === "approved") {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>I-983</h3>
        </div>
        <div className="section-content">
          <a
            href={"https://www.ice.gov/doclib/sevis/pdf/i983.pdf"}
            download
            target="_blank"
          >
            <button>Empty Template</button>
          </a>
          <a
            href={
              "https://isss.utah.edu/forms-publications/documents/f-1/f1-form-i-983-sample.pdf"
            }
            download
            target="_blank"
          >
            <button>Sample Template</button>
          </a>
          <div className={"pending-message"}>Please upload you file.</div>
        </div>
        <FileUpload
          label="I-983"
          name="I983"
          accept=".pdf"
          fileType="I983"
          onUploadSuccess={async (docId, docUrl) => {
            const data = await createOpt({
              type: "I-983",
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
  if (stage === "I-983" && status === "pending") {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>
            I-983
            <span className={`info-value status-badge status-pending`}>
              Pending
            </span>
          </h3>
        </div>
        <div className="section-content">
          <a
            href={"https://www.ice.gov/doclib/sevis/pdf/i983.pdf"}
            download
            target="_blank"
          >
            <button>Empty Template</button>
          </a>
          <a
            href={
              "https://isss.utah.edu/forms-publications/documents/f-1/f1-form-i-983-sample.pdf"
            }
            download
            target="_blank"
          >
            <button>Sample Template</button>
          </a>
          <div className="pending-message">
            Waiting for HR to approve and sign your I-983.
          </div>
        </div>
      </div>
    );
  }
  if (stage === "I-983" && status === "rejected") {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>
            I-983
            <span className={`info-value status-badge status-rejected`}>
              Rejected
            </span>
          </h3>
        </div>
        <div className="section-content">
          <a
            href={"https://www.ice.gov/doclib/sevis/pdf/i983.pdf"}
            download
            target="_blank"
          >
            <button>Empty Template</button>
          </a>
          <a
            href={
              "https://isss.utah.edu/forms-publications/documents/f-1/f1-form-i-983-sample.pdf"
            }
            download
            target="_blank"
          >
            <button>Sample Template</button>
          </a>
          <div className="message error">
            Your I-983 is rejected. Please upload again.
            <br />
            Feekback: {feedback}
          </div>
          <FileUpload
            label="I-983"
            name="I983"
            accept=".pdf"
            fileType="I983"
            onUploadSuccess={async (docId, docUrl) => {
              const data = await createOpt({
                type: "I-983",
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
  if (stage === "I-20" || (stage === "I-983" && status === "approved")) {
    return (
      <div className="info-section">
        <div className="section-header">
          <h3>
            I-983
            <span className={`info-value status-badge status-approved`}>
              Approved
            </span>
          </h3>
        </div>
        <div className="section-content">
          <a
            href={"https://www.ice.gov/doclib/sevis/pdf/i983.pdf"}
            download
            target="_blank"
          >
            <button>Empty Template</button>
          </a>
          <a
            href={
              "https://isss.utah.edu/forms-publications/documents/f-1/f1-form-i-983-sample.pdf"
            }
            download
            target="_blank"
          >
            <button>Sample Template</button>
          </a>
          <div className="message success">
            Please send the I-983 along with all necessary documents to your
            school and upload the new I-20.
          </div>
        </div>
      </div>
    );
  }
};

export default VisaI983Section;
