import React from 'react';

const ReferenceSection = ({ formData, onChange }) => {
  return (
    <div className="form-section">
      <h3>Reference</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="reference_first_name">First Name</label>
          <input
            type="text"
            id="reference_first_name"
            name="reference_first_name"
            value={formData.reference_first_name}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reference_last_name">Last Name</label>
          <input
            type="text"
            id="reference_last_name"
            name="reference_last_name"
            value={formData.reference_last_name}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reference_middle_name">Middle Name</label>
          <input
            type="text"
            id="reference_middle_name"
            name="reference_middle_name"
            value={formData.reference_middle_name}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="reference_phone">Phone</label>
          <input
            type="tel"
            id="reference_phone"
            name="reference_phone"
            value={formData.reference_phone}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reference_email">Email</label>
          <input
            type="email"
            id="reference_email"
            name="reference_email"
            value={formData.reference_email}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reference_relationship">Relationship</label>
          <input
            type="text"
            id="reference_relationship"
            name="reference_relationship"
            value={formData.reference_relationship}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ReferenceSection;


