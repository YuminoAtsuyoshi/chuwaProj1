import React from "react";
import PISectionCard from "./PISectionCard";

const ContactSectionPI = ({
  employeeInfo,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  saving,
  tempData,
  onChange,
}) => {
  return (
    <PISectionCard
      title="Contact Information"
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
      saving={saving}
      childrenReadOnly={
        <>
          <div className="field">
            <label>Cell Phone:</label>
            <span>{employeeInfo.cellPhone || "N/A"}</span>
          </div>
          <div className="field">
            <label>Work Phone:</label>
            <span>{employeeInfo.workPhone || "N/A"}</span>
          </div>
          <div className="field">
            <label>Email:</label>
            <span>{employeeInfo.email || "N/A"}</span>
          </div>
        </>
      }
      childrenEdit={
        <>
          <div className="field">
            <label>Cell Phone *</label>
            <input
              type="tel"
              value={tempData.cellPhone}
              onChange={(e) => onChange("cellPhone", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Work Phone</label>
            <input
              type="tel"
              value={tempData.workPhone}
              onChange={(e) => onChange("workPhone", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={employeeInfo.email}
              readOnly
              className="readonly-input"
            />
          </div>
        </>
      }
    />
  );
};

export default ContactSectionPI;
