import React from "react";

const ReferenceSection = ({ formData, errors = {}, onChange }) => {
  return (
    <div className="form-section">
      <h3>Reference</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="referenceFirstName">First Name *</label>
          <input
            type="text"
            id="referenceFirstName"
            name="referenceFirstName"
            value={formData.referenceFirstName}
            onChange={onChange}
            className={errors.referenceFirstName ? "error" : ""}
          />
          {errors.referenceFirstName && (
            <span className="error-message">{errors.referenceFirstName}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="referenceLastName">Last Name *</label>
          <input
            type="text"
            id="referenceLastName"
            name="referenceLastName"
            value={formData.referenceLastName}
            onChange={onChange}
            className={errors.referenceLastName ? "error" : ""}
          />
          {errors.referenceLastName && (
            <span className="error-message">{errors.referenceLastName}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="referenceMiddleName">Middle Name</label>
          <input
            type="text"
            id="referenceMiddleName"
            name="referenceMiddleName"
            value={formData.referenceMiddleName}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="referencePhone">Phone</label>
          <input
            type="tel"
            id="referencePhone"
            name="referencePhone"
            value={formData.referencePhone}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="referenceEmail">Email</label>
          <input
            type="email"
            id="referenceEmail"
            name="referenceEmail"
            value={formData.referenceEmail}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="referenceRelationship">Relationship *</label>
          <input
            type="text"
            id="referenceRelationship"
            name="referenceRelationship"
            value={formData.referenceRelationship}
            onChange={onChange}
            className={errors.referenceRelationship ? "error" : ""}
          />
          {errors.referenceRelationship && (
            <span className="error-message">{errors.referenceRelationship}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferenceSection;
