import React from 'react';
import FileUpload from '../../../components/FileUpload';

const ContactInfoSection = ({ formData, errors, onChange, onUploadSuccess, onUploadError }) => {
  return (
    <div className="form-section">
      <h3>Contact Information</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="cell_phone">Cell Phone *</label>
          <input
            type="tel"
            id="cell_phone"
            name="cell_phone"
            value={formData.cell_phone}
            onChange={onChange}
            className={errors.cell_phone ? 'error' : ''}
          />
          {errors.cell_phone && <span className="error-message">{errors.cell_phone}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="work_phone">Work Phone</label>
          <input
            type="tel"
            id="work_phone"
            name="work_phone"
            value={formData.work_phone}
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
        onUploadSuccess={(docId, docUrl) => onUploadSuccess('driverLicenseDocId', docId, docUrl)}
        onUploadError={(error) => onUploadError('driverLicenseDocId', error)}
        className={errors.driverLicenseDocId ? 'error' : ''}
      />
      {errors.driverLicenseDocId && <span className="error-message">{errors.driverLicenseDocId}</span>}
    </div>
  );
};

export default ContactInfoSection;


