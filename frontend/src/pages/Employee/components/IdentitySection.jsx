import React from 'react';
import { GENDER_OPTIONS } from '../../../constants/options';

const IdentitySection = ({ formData, errors, onChange }) => {
  return (
    <div className="form-section">
      <h3>Identity Information</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ssn">Social Security Number *</label>
          <input
            type="text"
            id="ssn"
            name="ssn"
            value={formData.ssn}
            onChange={onChange}
            placeholder="XXX-XX-XXXX"
            className={errors.ssn ? 'error' : ''}
          />
          {errors.ssn && <span className="error-message">{errors.ssn}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="date_of_birth">Date of Birth *</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={onChange}
            className={errors.date_of_birth ? 'error' : ''}
          />
          {errors.date_of_birth && <span className="error-message">{errors.date_of_birth}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender *</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={onChange}
            className={errors.gender ? 'error' : ''}
          >
            <option value="">Select Gender</option>
            {GENDER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {errors.gender && <span className="error-message">{errors.gender}</span>}
        </div>
      </div>
    </div>
  );
};

export default IdentitySection;


