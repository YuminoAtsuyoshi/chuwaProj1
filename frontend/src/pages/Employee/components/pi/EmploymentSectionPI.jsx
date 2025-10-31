import React from "react";

const EmploymentSectionPI = ({ employeeInfo }) => {
  const displayTitle =
    employeeInfo?.visaTitle && employeeInfo.visaTitle.trim()
      ? employeeInfo.visaTitle
      : employeeInfo?.isPrOrCitizen === "yes"
      ? employeeInfo?.prOrCitizenType || "N/A"
      : employeeInfo?.workAuthType || "N/A";

  return (
    <div className="info-section">
      <div className="section-header">
        <h3>Employment</h3>
      </div>
      <div className="readonly-fields">
        <div className="field">
          <label>Visa Title</label>
          <span>{displayTitle}</span>
        </div>
        <div className="field">
          <label>Start Date</label>
          <span>{employeeInfo?.visaStartDate || "N/A"}</span>
        </div>
        <div className="field">
          <label>End Date</label>
          <span>{employeeInfo?.visaEndDate || "N/A"}</span>
        </div>
      </div>
    </div>
  );
};

export default EmploymentSectionPI;


