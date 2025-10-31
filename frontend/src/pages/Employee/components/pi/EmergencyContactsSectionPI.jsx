import React from "react";

const EmergencyContactsSectionPI = ({ contacts = [] }) => {
  const list = Array.isArray(contacts) ? contacts : [];
  return (
    <div className="info-section">
      <div className="section-header">
        <h3>Emergency Contacts</h3>
      </div>
      {list.length === 0 ? (
        <div className="no-data">
          <h2>No Emergency Contacts</h2>
          <p>Please provide at least one emergency contact in onboarding.</p>
        </div>
      ) : (
        <div className="readonly-fields">
          {list.map((c, idx) => (
            <div key={idx} className="info-card-lite" style={{ display: "contents" }}>
              <div className="field">
                <label>First Name</label>
                <span>{c.firstName || "N/A"}</span>
              </div>
              <div className="field">
                <label>Last Name</label>
                <span>{c.lastName || "N/A"}</span>
              </div>
              <div className="field">
                <label>Middle Name</label>
                <span>{c.middleName || "N/A"}</span>
              </div>
              <div className="field">
                <label>Phone</label>
                <span>{c.phone || "N/A"}</span>
              </div>
              <div className="field">
                <label>Email</label>
                <span>{c.email || "N/A"}</span>
              </div>
              <div className="field">
                <label>Relationship</label>
                <span>{c.relationship || "N/A"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmergencyContactsSectionPI;


