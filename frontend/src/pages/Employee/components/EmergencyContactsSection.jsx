import React from 'react';

const EmergencyContactsSection = ({ contacts, errors, onChange, onAdd, onRemove }) => {
  return (
    <div className="form-section">
      <h3>Emergency Contacts</h3>
      {contacts.map((contact, index) => (
        <div key={index} className="emergency-contact">
          <div className="contact-header">
            <h4>Emergency Contact {index + 1}</h4>
            {contacts.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="remove-contact-btn"
              >
                Remove
              </button>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`emergency_first_name_${index}`}>First Name *</label>
              <input
                type="text"
                id={`emergency_first_name_${index}`}
                value={contact.first_name}
                onChange={(e) => onChange(index, 'first_name', e.target.value)}
                className={errors[`emergency_contact_${index}`] ? 'error' : ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor={`emergency_last_name_${index}`}>Last Name *</label>
              <input
                type="text"
                id={`emergency_last_name_${index}`}
                value={contact.last_name}
                onChange={(e) => onChange(index, 'last_name', e.target.value)}
                className={errors[`emergency_contact_${index}`] ? 'error' : ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor={`emergency_middle_name_${index}`}>Middle Name</label>
              <input
                type="text"
                id={`emergency_middle_name_${index}`}
                value={contact.middle_name}
                onChange={(e) => onChange(index, 'middle_name', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`emergency_phone_${index}`}>Phone *</label>
              <input
                type="tel"
                id={`emergency_phone_${index}`}
                value={contact.phone}
                onChange={(e) => onChange(index, 'phone', e.target.value)}
                className={errors[`emergency_contact_${index}`] ? 'error' : ''}
              />
            </div>
            <div className="form-group">
              <label htmlFor={`emergency_email_${index}`}>Email</label>
              <input
                type="email"
                id={`emergency_email_${index}`}
                value={contact.email}
                onChange={(e) => onChange(index, 'email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor={`emergency_relationship_${index}`}>Relationship *</label>
              <input
                type="text"
                id={`emergency_relationship_${index}`}
                value={contact.relationship}
                onChange={(e) => onChange(index, 'relationship', e.target.value)}
                className={errors[`emergency_contact_${index}`] ? 'error' : ''}
              />
            </div>
          </div>

          {errors[`emergency_contact_${index}`] && (
            <span className="error-message">{errors[`emergency_contact_${index}`]}</span>
          )}
        </div>
      ))}

      <button type="button" onClick={onAdd} className="add-contact-btn">
        Add New Emergency Contact
      </button>
    </div>
  );
};

export default EmergencyContactsSection;


