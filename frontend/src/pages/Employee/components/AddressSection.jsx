import React from 'react';
import { US_STATES } from '../../../constants/states';

const AddressSection = ({ formData, errors, onChange }) => {
  return (
    <div className="form-section">
      <h3>Current Address</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="address_building">Building/Apartment *</label>
          <input
            type="text"
            id="address_building"
            name="address_building"
            value={formData.address_building}
            onChange={onChange}
            className={errors.address_building ? 'error' : ''}
          />
          {errors.address_building && <span className="error-message">{errors.address_building}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="address_street">Street Address *</label>
          <input
            type="text"
            id="address_street"
            name="address_street"
            value={formData.address_street}
            onChange={onChange}
            className={errors.address_street ? 'error' : ''}
          />
          {errors.address_street && <span className="error-message">{errors.address_street}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="address_city">City *</label>
          <input
            type="text"
            id="address_city"
            name="address_city"
            value={formData.address_city}
            onChange={onChange}
            className={errors.address_city ? 'error' : ''}
          />
          {errors.address_city && <span className="error-message">{errors.address_city}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="address_state">State *</label>
          <select
            id="address_state"
            name="address_state"
            value={formData.address_state}
            onChange={onChange}
            className={errors.address_state ? 'error' : ''}
          >
            <option value="">Select State</option>
            {US_STATES.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
          {errors.address_state && <span className="error-message">{errors.address_state}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="address_zip">ZIP Code *</label>
          <input
            type="text"
            id="address_zip"
            name="address_zip"
            value={formData.address_zip}
            onChange={onChange}
            className={errors.address_zip ? 'error' : ''}
          />
          {errors.address_zip && <span className="error-message">{errors.address_zip}</span>}
        </div>
      </div>
    </div>
  );
};

export default AddressSection;


