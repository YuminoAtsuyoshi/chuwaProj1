import React from 'react';
import FileUpload from '../../../components/FileUpload';

const WorkAuthSection = ({ formData, errors, onChange, onUploadSuccess, onUploadError }) => {
  return (
    <div className="form-section">
      <h3>Citizenship/Work Authorization</h3>
      <div className="form-group">
        <label>Permanent resident or citizen of the U.S.? *</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="is_pr_or_citizen"
              value="yes"
              checked={formData.is_pr_or_citizen === 'yes'}
              onChange={onChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="is_pr_or_citizen"
              value="no"
              checked={formData.is_pr_or_citizen === 'no'}
              onChange={onChange}
            />
            No
          </label>
        </div>
        {errors.is_pr_or_citizen && <span className="error-message">{errors.is_pr_or_citizen}</span>}
      </div>

      {formData.is_pr_or_citizen === 'yes' && (
        <div className="form-group">
          <label htmlFor="pr_or_citizen_type">Citizenship Type *</label>
          <select
            id="pr_or_citizen_type"
            name="pr_or_citizen_type"
            value={formData.pr_or_citizen_type}
            onChange={onChange}
            className={errors.pr_or_citizen_type ? 'error' : ''}
          >
            <option value="">Select Type</option>
            <option value="Green Card">Green Card</option>
            <option value="Citizen">Citizen</option>
          </select>
          {errors.pr_or_citizen_type && <span className="error-message">{errors.pr_or_citizen_type}</span>}
        </div>
      )}

      {formData.is_pr_or_citizen === 'no' && (
        <div className="form-group">
          <label htmlFor="work_auth_type">Work Authorization Type *</label>
          <select
            id="work_auth_type"
            name="work_auth_type"
            value={formData.work_auth_type}
            onChange={onChange}
            className={errors.work_auth_type ? 'error' : ''}
          >
            <option value="">Select Type</option>
            <option value="H1-B">H1-B</option>
            <option value="L2">L2</option>
            <option value="F1(CPT/OPT)">F1(CPT/OPT)</option>
            <option value="H4">H4</option>
            <option value="Other">Other</option>
          </select>
          {errors.work_auth_type && <span className="error-message">{errors.work_auth_type}</span>}
        </div>
      )}

      {formData.work_auth_type === 'F1(CPT/OPT)' && (
        <div>
          <FileUpload
            label="OPT Receipt"
            name="opt_receipt"
            accept=".pdf,.jpg,.jpeg,.png"
            fileType="optReceiptDocId"
            onUploadSuccess={(docId, docUrl) => onUploadSuccess('optReceiptDocId', docId, docUrl)}
            onUploadError={(error) => onUploadError('optReceiptDocId', error)}
            className={errors.optReceiptDocId ? 'error' : ''}
            required={true}
          />
          {errors.optReceiptDocId && <span className="error-message">{errors.optReceiptDocId}</span>}
        </div>
      )}

      {formData.work_auth_type === 'Other' && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="visa_title">Visa Title</label>
            <input
              type="text"
              id="visa_title"
              name="visa_title"
              value={formData.visa_title}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="visa_start_date">Visa Start Date</label>
            <input
              type="date"
              id="visa_start_date"
              name="visa_start_date"
              value={formData.visa_start_date}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="visa_end_date">Visa End Date</label>
            <input
              type="date"
              id="visa_end_date"
              name="visa_end_date"
              value={formData.visa_end_date}
              onChange={onChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkAuthSection;


