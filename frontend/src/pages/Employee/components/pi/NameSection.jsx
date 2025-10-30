import React from "react";
import PISectionCard from "./PISectionCard";

const NameSection = ({
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
      title="Name"
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
      saving={saving}
      childrenReadOnly={
        <>
          <div className="field">
            <label>First Name:</label>
            <span>{employeeInfo.firstName || "N/A"}</span>
          </div>
          <div className="field">
            <label>Last Name:</label>
            <span>{employeeInfo.lastName || "N/A"}</span>
          </div>
          <div className="field">
            <label>Middle Name:</label>
            <span>{employeeInfo.middleName || "N/A"}</span>
          </div>
          <div className="field">
            <label>Preferred Name:</label>
            <span>{employeeInfo.preferredName || "N/A"}</span>
          </div>
        </>
      }
      childrenEdit={
        <>
          <div className="field">
            <label>First Name *</label>
            <input
              type="text"
              value={tempData.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Last Name *</label>
            <input
              type="text"
              value={tempData.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Middle Name</label>
            <input
              type="text"
              value={tempData.middleName}
              onChange={(e) => onChange("middleName", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Preferred Name</label>
            <input
              type="text"
              value={tempData.preferredName}
              onChange={(e) => onChange("preferredName", e.target.value)}
            />
          </div>
        </>
      }
    />
  );
};

export default NameSection;
