import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getEmployeerInfo, getDocumentUrl } from "../../api/auth";
import { logout } from "../../store";
import EmployeeNav from "../../components/EmployeeNav";
import "./PersonalInformationPage.css";
import { usePIEditing } from "./hooks/usePIEditing";
import NameSection from "./components/pi/NameSection";
import AddressSectionPI from "./components/pi/AddressSectionPI";
import ContactSectionPI from "./components/pi/ContactSectionPI";
import IdentitySectionPI from "./components/pi/IdentitySectionPI";
import EmploymentSectionPI from "./components/pi/EmploymentSectionPI";
import EmergencyContactsSectionPI from "./components/pi/EmergencyContactsSectionPI";

const PersonalInformationPage = () => {
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const {
    saving,
    editModes,
    tempData,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
  } = usePIEditing({
    user,
    employeeInfo,
    setEmployeeInfo,
    setMessage,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      // Check for test user data first (for testing without backend)
      const testUser = localStorage.getItem("testUser");
      if (testUser) {
        try {
          const testUserData = JSON.parse(testUser);

          // Mock employeer info for testing
          const mockEmployeerInfo = {
            first_name: "John",
            last_name: "Doe",
            middle_name: "Michael",
            preferred_name: "Johnny",
            address_building: "Apt 2B",
            address_street: "123 Main St",
            address_city: "New York",
            address_state: "NY",
            address_zip: "10001",
            cell_phone: "555-123-4567",
            work_phone: "555-987-6543",
            email: "john.doe@company.com",
            ssn: "123-45-6789",
            date_of_birth: "1990-01-15",
            gender: "male",
            is_pr_or_citizen: "yes",
            pr_or_citizen_type: "Citizen",
            profile_picture_ref: "doc-123",
            driver_license_ref: "doc-456",
          };
          setEmployeeInfo(mockEmployeerInfo);
          setLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing test user data:", error);
        }
      }

      if (!user?._id) return;

      try {
        setLoading(true);
        const data = await getEmployeerInfo(user._id);
        setEmployeeInfo(data);
      } catch (error) {
        console.error("Error fetching employeer info:", error);
        setMessage("Failed to load personal information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  // handlers moved to usePIEditing

  // Document management functions
  const handleDocumentDownload = async (docId, fileName) => {
    try {
      const response = await getDocumentUrl(docId);
      const link = document.createElement("a");
      link.href = response.url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      setMessage(`Download failed: ${error.message || "Unknown error"}`);
    }
  };

  const handleDocumentPreview = async (docId) => {
    try {
      const response = await getDocumentUrl(docId);
      window.open(response.url, "_blank");
    } catch (error) {
      console.error("Preview failed:", error);
      setMessage(`Preview failed: ${error.message || "Unknown error"}`);
    }
  };

  if (loading) {
    return (
      <div className="personal-info-container">
        <EmployeeNav active="pi" />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!employeeInfo) {
    return (
      <div className="personal-info-container">
        <EmployeeNav active="pi" />
        <div className="no-data">
          <h2>No Personal Information Available</h2>
          <p>Please complete your onboarding application first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="personal-info-container">
      <EmployeeNav active="pi" />
      <div className="page-header">
        <h1>Personal Information</h1>
        <p>View and manage your personal information</p>
      </div>

      {message && (
        <div
          className={`message ${
            message.includes("successfully") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      <NameSection
        employeeInfo={employeeInfo}
        isEditing={editModes.name}
        onEdit={() => handleEdit("name")}
        onSave={() => handleSave("name")}
        onCancel={() => handleCancel("name")}
        saving={saving}
        tempData={tempData}
        onChange={handleInputChange}
      />

      <AddressSectionPI
        employeeInfo={employeeInfo}
        isEditing={editModes.address}
        onEdit={() => handleEdit("address")}
        onSave={() => handleSave("address")}
        onCancel={() => handleCancel("address")}
        saving={saving}
        tempData={tempData}
        onChange={handleInputChange}
      />

      <ContactSectionPI
        employeeInfo={employeeInfo}
        isEditing={editModes.contact}
        onEdit={() => handleEdit("contact")}
        onSave={() => handleSave("contact")}
        onCancel={() => handleCancel("contact")}
        saving={saving}
        tempData={tempData}
        onChange={handleInputChange}
      />

      <IdentitySectionPI
        employeeInfo={employeeInfo}
        isEditing={editModes.identity}
        onEdit={() => handleEdit("identity")}
        onSave={() => handleSave("identity")}
        onCancel={() => handleCancel("identity")}
        saving={saving}
        tempData={tempData}
        onChange={handleInputChange}
      />

      {/* Employment (Visa) Section */}
      <EmploymentSectionPI employeeInfo={employeeInfo} />

      {/* Emergency Contacts Section */}
      <EmergencyContactsSectionPI contacts={employeeInfo?.emergencyContact} />

      {/* Documents Section */}
      <div className="info-section">
        <h3>Uploaded Documents</h3>
        <div className="document-list">
          {employeeInfo.profilePicture && (
            <div className="document-item">
              <div className="document-info">
                <span className="document-name">Profile Picture</span>
                <span className="document-type">Image</span>
              </div>
              <div className="document-actions">
                <button
                  onClick={() =>
                    handleDocumentPreview(employeeInfo.profilePicture)
                  }
                  className="preview-btn"
                >
                  Preview
                </button>
                <button
                  onClick={() =>
                    handleDocumentDownload(
                      employeeInfo.profilePicture,
                      "profile-picture"
                    )
                  }
                  className="download-btn"
                >
                  Download
                </button>
              </div>
            </div>
          )}

          {employeeInfo.driverLicense && (
            <div className="document-item">
              <div className="document-info">
                <span className="document-name">Driver's License</span>
                <span className="document-type">Document</span>
              </div>
              <div className="document-actions">
                <button
                  onClick={() =>
                    handleDocumentPreview(employeeInfo.driverLicense)
                  }
                  className="preview-btn"
                >
                  Preview
                </button>
                <button
                  onClick={() =>
                    handleDocumentDownload(
                      employeeInfo.driverLicense,
                      "drivers-license"
                    )
                  }
                  className="download-btn"
                >
                  Download
                </button>
              </div>
            </div>
          )}

          {/* Work Authorization Document */}
          {employeeInfo.workAuthDoc && (
            <div className="document-item">
              <div className="document-info">
                <span className="document-name">Work Authorization</span>
                <span className="document-type">Document</span>
              </div>
              <div className="document-actions">
                <button
                  onClick={() =>
                    handleDocumentPreview(employeeInfo.workAuthDoc)
                  }
                  className="preview-btn"
                >
                  Preview
                </button>
                <button
                  onClick={() =>
                    handleDocumentDownload(
                      employeeInfo.workAuthDoc,
                      "work-authorization"
                    )
                  }
                  className="download-btn"
                >
                  Download
                </button>
              </div>
            </div>
          )}

          {/* OPT Receipt Document (F1 OPT) */}
          {employeeInfo.optReceipt && (
            <div className="document-item">
              <div className="document-info">
                <span className="document-name">OPT Receipt</span>
                <span className="document-type">Document</span>
              </div>
              <div className="document-actions">
                <button
                  onClick={() => handleDocumentPreview(employeeInfo.optReceipt)}
                  className="preview-btn"
                >
                  Preview
                </button>
                <button
                  onClick={() =>
                    handleDocumentDownload(
                      employeeInfo.optReceipt,
                      "opt-receipt"
                    )
                  }
                  className="download-btn"
                >
                  Download
                </button>
              </div>
            </div>
          )}

          {!employeeInfo.profilePicture &&
            !employeeInfo.driverLicense &&
            !employeeInfo.optReceipt &&
            !employeeInfo.workAuthDoc && (
              <div className="no-documents">
                <p>No documents uploaded.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationPage;
