import React from "react";
import PISectionCard from "./PISectionCard";
import { GENDER_OPTIONS } from "../../../../constants/options";

const IdentitySectionPI = ({
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
      title="Identity Information"
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
      saving={saving}
      childrenReadOnly={
        <>
          <div className="field">
            <label>SSN:</label>
            <span>{employeeInfo.ssn || "N/A"}</span>
          </div>
          <div className="field">
            <label>Date of Birth:</label>
            <span>{employeeInfo.dateOfBirth || "N/A"}</span>
          </div>
          <div className="field">
            <label>Gender:</label>
            <span>{employeeInfo.gender || "N/A"}</span>
          </div>
        </>
      }
      childrenEdit={
        <>
          <div className="field">
            <label>SSN *</label>
            <input
              type="text"
              value={tempData.ssn}
              onChange={(e) => onChange("ssn", e.target.value)}
              placeholder="XXX-XX-XXXX"
            />
          </div>
          <div className="field">
            <label>Date of Birth *</label>
            <input
              type="date"
              value={tempData.dateOfBirth}
              onChange={(e) => onChange("dateOfBirth", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Gender *</label>
            <select
              value={tempData.gender}
              onChange={(e) => onChange("gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </>
      }
    />
  );
};

export default IdentitySectionPI;
