import React from 'react';
import FileUpload from '../../../components/FileUpload';

const PersonalDetailsSection = ({ formData, errors, onChange, onUploadSuccess, onUploadError }) => {
  return (
    <div className="form-section">
      <h3>Personal Details</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="first_name">First Name *</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={onChange}
            className={errors.first_name ? 'error' : ''}
          />
          {errors.first_name && <span className="error-message">{errors.first_name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name *</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={onChange}
            className={errors.last_name ? 'error' : ''}
          />
          {errors.last_name && <span className="error-message">{errors.last_name}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="middle_name">Middle Name</label>
          <input
            type="text"
            id="middle_name"
            name="middle_name"
            value={formData.middle_name}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="preferred_name">Preferred Name</label>
          <input
            type="text"
            id="preferred_name"
            name="preferred_name"
            value={formData.preferred_name}
            onChange={onChange}
          />
        </div>
      </div>

      <FileUpload
        label="Profile Picture"
        name="profile_picture"
        accept="image/*"
        fileType="profilePictureDocId"
        onUploadSuccess={(docId, docUrl) => onUploadSuccess('profilePictureDocId', docId, docUrl)}
        onUploadError={(error) => onUploadError('profilePictureDocId', error)}
        className={errors.profilePictureDocId ? 'error' : ''}
      />
      {errors.profilePictureDocId && <span className="error-message">{errors.profilePictureDocId}</span>}
    </div>
  );
};

export default PersonalDetailsSection;


