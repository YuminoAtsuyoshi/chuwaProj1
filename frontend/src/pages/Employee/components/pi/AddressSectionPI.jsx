import React from "react";
import PISectionCard from "./PISectionCard";
import { US_STATES } from "../../../../constants/states";

const AddressSectionPI = ({
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
      title="Address"
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
      saving={saving}
      childrenReadOnly={
        <>
          <div className="field">
            <label>Building/Apartment:</label>
            <span>{employeeInfo.addressBuilding || "N/A"}</span>
          </div>
          <div className="field">
            <label>Street Address:</label>
            <span>{employeeInfo.addressStreet || "N/A"}</span>
          </div>
          <div className="field">
            <label>City:</label>
            <span>{employeeInfo.addressCity || "N/A"}</span>
          </div>
          <div className="field">
            <label>State:</label>
            <span>{employeeInfo.addressState || "N/A"}</span>
          </div>
          <div className="field">
            <label>ZIP Code:</label>
            <span>{employeeInfo.addressZip || "N/A"}</span>
          </div>
        </>
      }
      childrenEdit={
        <>
          <div className="field">
            <label>Building/Apartment *</label>
            <input
              type="text"
              value={tempData.addressBuilding}
              onChange={(e) => onChange("addressBuilding", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Street Address *</label>
            <input
              type="text"
              value={tempData.addressStreet}
              onChange={(e) => onChange("addressStreet", e.target.value)}
            />
          </div>
          <div className="field">
            <label>City *</label>
            <input
              type="text"
              value={tempData.addressCity}
              onChange={(e) => onChange("addressCity", e.target.value)}
            />
          </div>
          <div className="field">
            <label>State *</label>
            <select
              value={tempData.addressState}
              onChange={(e) => onChange("addressState", e.target.value)}
            >
              <option value="">Select State</option>
              {US_STATES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>ZIP Code *</label>
            <input
              type="text"
              value={tempData.addressZip}
              onChange={(e) => onChange("addressZip", e.target.value)}
            />
          </div>
        </>
      }
    />
  );
};

export default AddressSectionPI;
