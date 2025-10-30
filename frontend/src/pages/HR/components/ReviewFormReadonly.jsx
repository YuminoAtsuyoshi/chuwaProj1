import React from "react";

const ReviewFormReadonly = ({ employeeInfo, getWorkAuthTitle }) => {
  if (!employeeInfo) return null;
  return (
    <div className="application-review">
      {/* Personal Details */}
      <div className="review-section">
        <h2>Personal Details</h2>
        <div className="field-grid">
          <div className="field">
            <label>First Name:</label>
            <span>{employeeInfo.firstName || "N/A"}</span>
          </div>
          <div className="field">
            <label>Last Name:</label>
            <span>{employeeInfo.lastName || "N/A"}</span>
          </div>
          <div className="field">
            <label>Middle Name:</label>
            <span>{employeeInfo.middleName || "N/A"}</span>
          </div>
          <div className="field">
            <label>Preferred Name:</label>
            <span>{employeeInfo.preferredName || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="review-section">
        <h2>Address</h2>
        <div className="field-grid">
          <div className="field">
            <label>Building/Apartment:</label>
            <span>{employeeInfo.addressBuilding || "N/A"}</span>
          </div>
          <div className="field">
            <label>Street Address:</label>
            <span>{employeeInfo.addressStreet || "N/A"}</span>
          </div>
          <div className="field">
            <label>City:</label>
            <span>{employeeInfo.addressCity || "N/A"}</span>
          </div>
          <div className="field">
            <label>State:</label>
            <span>{employeeInfo.addressState || "N/A"}</span>
          </div>
          <div className="field">
            <label>ZIP Code:</label>
            <span>{employeeInfo.addressZip || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="review-section">
        <h2>Contact Information</h2>
        <div className="field-grid">
          <div className="field">
            <label>Cell Phone:</label>
            <span>{employeeInfo.cellPhone || "N/A"}</span>
          </div>
          <div className="field">
            <label>Work Phone:</label>
            <span>{employeeInfo.workPhone || "N/A"}</span>
          </div>
          <div className="field">
            <label>Email:</label>
            <span>{employeeInfo.email || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Identity */}
      <div className="review-section">
        <h2>Identity Information</h2>
        <div className="field-grid">
          <div className="field">
            <label>SSN:</label>
            <span>{employeeInfo.ssn || "N/A"}</span>
          </div>
          <div className="field">
            <label>Date of Birth:</label>
            <span>{employeeInfo.dateOfBirth || "N/A"}</span>
          </div>
          <div className="field">
            <label>Gender:</label>
            <span>{employeeInfo.gender || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Citizenship / Work Auth */}
      <div className="review-section">
        <h2>Citizenship/Work Authorization</h2>
        <div className="field-grid">
          <div className="field">
            <label>Permanent resident or citizen of the U.S.:</label>
            <span>{employeeInfo.isPrOrCitizen === "yes" ? "Yes" : "No"}</span>
          </div>
          {employeeInfo.isPrOrCitizen === "yes" && (
            <div className="field">
              <label>Citizenship Type:</label>
              <span>{employeeInfo.prOrCitizenType || "N/A"}</span>
            </div>
          )}
          {employeeInfo.isPrOrCitizen === "no" && (
            <>
              <div className="field">
                <label>Work Authorization Type:</label>
                <span>{getWorkAuthTitle()}</span>
              </div>
              {employeeInfo.workAuthStart && (
                <div className="field">
                  <label>Work Auth Start Date:</label>
                  <span>{employeeInfo.workAuthStart}</span>
                </div>
              )}
              {employeeInfo.workAuthEnd && (
                <div className="field">
                  <label>Work Auth End Date:</label>
                  <span>{employeeInfo.workAuthEnd}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Reference */}
      {employeeInfo.reference && (
        <div className="review-section">
          <h2>Reference</h2>
          <div className="field-grid">
            <div className="field">
              <label>First Name:</label>
              <span>{employeeInfo.reference.firstName || "N/A"}</span>
            </div>
            <div className="field">
              <label>Last Name:</label>
              <span>{employeeInfo.reference.lastName || "N/A"}</span>
            </div>
            <div className="field">
              <label>Email:</label>
              <span>{employeeInfo.reference.email || "N/A"}</span>
            </div>
            <div className="field">
              <label>Phone:</label>
              <span>{employeeInfo.reference.phone || "N/A"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contacts */}
      {employeeInfo.emergencyContact &&
        employeeInfo.emergencyContact.length > 0 && (
          <div className="review-section">
            <h2>Emergency Contacts</h2>
            {employeeInfo.emergencyContact.map((contact, index) => (
              <div key={index} className="emergency-contact-card">
                <h3>Contact {index + 1}</h3>
                <div className="field-grid">
                  <div className="field">
                    <label>First Name:</label>
                    <span>{contact.firstName || "N/A"}</span>
                  </div>
                  <div className="field">
                    <label>Last Name:</label>
                    <span>{contact.lastName || "N/A"}</span>
                  </div>
                  <div className="field">
                    <label>Phone:</label>
                    <span>{contact.phone || "N/A"}</span>
                  </div>
                  <div className="field">
                    <label>Email:</label>
                    <span>{contact.email || "N/A"}</span>
                  </div>
                  <div className="field">
                    <label>Relationship:</label>
                    <span>{contact.relationship || "N/A"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

export default ReviewFormReadonly;
