import React from "react";
import { US_STATES } from "../../../constants/states";

const AddressSection = ({ formData, errors, onChange }) => {
  return (
    <div className="form-section">
      <h3>Current Address</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="addressBuilding">Building/Apartment *</label>
          <input
            type="text"
            id="addressBuilding"
            name="addressBuilding"
            value={formData.addressBuilding}
            onChange={onChange}
            className={errors.addressBuilding ? "error" : ""}
          />
          {errors.addressBuilding && (
            <span className="error-message">{errors.addressBuilding}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="address_street">Street Address *</label>
          <input
            type="text"
            id="addressStreet"
            name="addressStreet"
            value={formData.addressStreet}
            onChange={onChange}
            className={errors.address_street ? "error" : ""}
          />
          {errors.addressStreet && (
            <span className="error-message">{errors.addressStreet}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="addressCity">City *</label>
          <input
            type="text"
            id="addressCity"
            name="addressCity"
            value={formData.addressCity}
            onChange={onChange}
            className={errors.addressCity ? "error" : ""}
          />
          {errors.addressCity && (
            <span className="error-message">{errors.addressCity}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="addressState">State *</label>
          <select
            id="addressState"
            name="addressState"
            value={formData.addressState}
            onChange={onChange}
            className={errors.addressState ? "error" : ""}
          >
            <option value="">Select State</option>
            {US_STATES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          {errors.addressState && (
            <span className="error-message">{errors.addressState}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="addressZip">ZIP Code *</label>
          <input
            type="text"
            id="addressZip"
            name="addressZip"
            value={formData.addressZip}
            onChange={onChange}
            className={errors.addressZip ? "error" : ""}
          />
          {errors.addressZip && (
            <span className="error-message">{errors.addressZip}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
