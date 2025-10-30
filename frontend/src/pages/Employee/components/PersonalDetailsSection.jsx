import React from "react";
import FileUpload from "../../../components/FileUpload";

const PersonalDetailsSection = ({
  formData,
  errors,
  onChange,
  onUploadSuccess,
  onUploadError,
}) => {
  return (
    <div className="form-section">
      <h3>Personal Details</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            className={errors.firstName ? "error" : ""}
          />
          {errors.first_name && (
            <span className="error-message">{errors.firstName}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            className={errors.lastName ? "error" : ""}
          />
          {errors.lastName && (
            <span className="error-message">{errors.lastName}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="middleName">Middle Name</label>
          <input
            type="text"
            id="middleName"
            name="middleName"
            value={formData.middleName}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="preferredName">Preferred Name</label>
          <input
            type="text"
            id="preferredName"
            name="preferredName"
            value={formData.preferredName}
            onChange={onChange}
          />
        </div>
      </div>

      <FileUpload
        label="Profile Picture"
        name="profilePicture"
        accept="image/*"
        fileType="profilePictureDocId"
        onUploadSuccess={(docId, docUrl) =>
          onUploadSuccess("profilePictureDocId", docId, docUrl)
        }
        onUploadError={(error) => onUploadError("profilePictureDocId", error)}
        className={errors.profilePictureDocId ? "error" : ""}
      />
      {errors.profilePictureDocId && (
        <span className="error-message">{errors.profilePictureDocId}</span>
      )}
    </div>
  );
};

export default PersonalDetailsSection;
