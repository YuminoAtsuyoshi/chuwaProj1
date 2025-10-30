import React from "react";
import FileUpload from "../../../components/FileUpload";

const ContactInfoSection = ({
  formData,
  errors,
  onChange,
  onUploadSuccess,
  onUploadError,
}) => {
  return (
    <div className="form-section">
      <h3>Contact Information</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cellPhone">Cell Phone *</label>
          <input
            type="tel"
            id="cellPhone"
            name="cellPhone"
            value={formData.cellPhone}
            onChange={onChange}
            className={errors.cellPhone ? "error" : ""}
          />
          {errors.cellPhone && (
            <span className="error-message">{errors.cellPhone}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="workPhone">Work Phone</label>
          <input
            type="tel"
            id="workPhone"
            name="workPhone"
            value={formData.workPhone}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          readOnly
          className="readonly-field"
        />
      </div>

      <FileUpload
        label="Driver's License"
        name="driver_license"
        accept="image/*,.pdf"
        fileType="driverLicenseDocId"
        onUploadSuccess={(docId, docUrl) =>
          onUploadSuccess("driverLicenseDocId", docId, docUrl)
        }
        onUploadError={(error) => onUploadError("driverLicenseDocId", error)}
        className={errors.driverLicenseDocId ? "error" : ""}
      />
      {errors.driverLicenseDocId && (
        <span className="error-message">{errors.driverLicenseDocId}</span>
      )}
    </div>
  );
};

export default ContactInfoSection;
