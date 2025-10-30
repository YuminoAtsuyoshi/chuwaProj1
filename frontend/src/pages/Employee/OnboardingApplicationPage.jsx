import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getEmployeeDetails, getEmployeerInfo } from "../../api/auth";
import { logout } from "../../store";
import FileUpload from "../../components/FileUpload";
import FilesSummary from "./components/FilesSummary";
import WorkAuthSection from "./components/WorkAuthSection";
import ReferenceSection from "./components/ReferenceSection";
import EmergencyContactsSection from "./components/EmergencyContactsSection";
import { useFileUpload } from "./hooks/useFileUpload";
import { useOnboardingForm } from "./hooks/useOnboardingForm";
import ContactInfoSection from "./components/ContactInfoSection";
import IdentitySection from "./components/IdentitySection";
import PersonalDetailsSection from "./components/PersonalDetailsSection";
import AddressSection from "./components/AddressSection";
import "./OnboardingApplicationPage.css";

const OnboardingApplicationPage = () => {
  const [employee, setEmployee] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [message, setMessage] = useState("");

  // File upload state and handlers
  const {
    uploadedFiles,
    setUploadedFiles,
    handleFileUploadSuccess,
    handleFileUploadError,
    handleDocumentDownload,
    handleDocumentPreview,
  } = useFileUpload({ setErrors, setMessage });

  // Get user data from Redux store
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form state
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: "",
    lastName: "",
    middleName: "",
    preferredName: "",
    profilePicture: null,

    // Address
    addressBuilding: "",
    addressStreet: "",
    addressCity: "",
    addressState: "",
    addressZip: "",

    // Contact Info
    cellPhone: "",
    workPhone: "",
    email: "",

    // Identity
    ssn: "",
    dateOfBirth: "",
    gender: "",

    // Citizenship/Work Authorization
    isPrOrCitizen: "",
    prOrCitizenType: "",
    workAuthType: "",
    optReceipt: null,
    visaTitle: "",
    visaStartDate: "",
    visaEndDate: "",

    // Reference
    referenceFirstName: "",
    referenceLastName: "",
    referenceMiddleName: "",
    referencePhone: "",
    referenceEmail: "",
    referenceRelationship: "",

    // Emergency Contacts
    emergencyContact: [
      {
        firstName: "",
        lastName: "",
        middleName: "",
        phone: "",
        email: "",
        relationship: "",
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      // Check for test user data first (for testing without backend)
      const testUser = localStorage.getItem("testUser");
      if (testUser) {
        try {
          const testUserData = JSON.parse(testUser);
          setEmployee(testUserData);
          setFormData((prev) => ({
            ...prev,
            email: testUserData.email || "",
          }));

          // Handle approved status redirection
          if (
            testUserData.stage === "onboarding" &&
            testUserData.status === "approved"
          ) {
            navigate("/employee/dashboard");
            return;
          }

          setLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing test user data:", error);
        }
      }

      if (!user?._id) return;

      try {
        setLoading(true);

        // Fetch employee details
        const employeeData = await getEmployeeDetails(user._id);
        setEmployee(employeeData);

        // Handle approved status redirection
        if (
          employeeData.stage === "onboarding" &&
          employeeData.status === "approved"
        ) {
          navigate("/employee/dashboard");
          return;
        }

        // Pre-fill email from employee data
        setFormData((prev) => ({
          ...prev,
          email: employeeData.email || "",
        }));

        // Try to fetch existing employeer info
        try {
          const employeeData = await getEmployeerInfo(user._id);
          setEmployeeInfo(employeeData);

          // Pre-fill form with existing data
          if (employeeData) {
            setFormData((prev) => ({
              ...prev,
              ...employeeData,
              // Handle emergency contacts array
              emergencyContacts: employeeData.emergencyContacts || [
                {
                  firstName: "",
                  lastName: "",
                  middleName: "",
                  phone: "",
                  email: "",
                  relationship: "",
                },
              ],
            }));

            // Set uploaded file IDs for document management
            setUploadedFiles((prev) => ({
              ...prev,
              profilePictureDocId: employeeData.profilePicture,
              driverLicenseDocId: employeeData.driverLicense,
              optReceiptDocId: employeeData.optReceiptUpload,
            }));
          }
        } catch (error) {
          // No existing employeer info found, that's okay
          console.log("No existing employeer info found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // File upload handlers moved to useFileUpload hook

  const handleEmergencyContactChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: prev.emergencyContact.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      ),
    }));
  };

  const addEmergencyContact = () => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: [
        ...prev.emergencyContact,
        {
          firstName: "",
          lastName: "",
          middleName: "",
          phone: "",
          email: "",
          relationship: "",
        },
      ],
    }));
  };

  const removeEmergencyContact = (index) => {
    if (formData.emergencyContact.length > 1) {
      setFormData((prev) => ({
        ...prev,
        emergencyContacts: prev.emergencyContact.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    const requiredFields = [
      "firstName",
      "lastName",
      "addressBuilding",
      "addressStreet",
      "addressCity",
      "addressState",
      "addressZip",
      "cellPhone",
      "ssn",
      "dateOfBirth",
      "gender",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace("_", " ")} is required`;
      }
    });

    // Citizenship/Work Authorization validation
    if (!formData.isPrOrCitizen) {
      newErrors.isPrOrCitizen = "Please specify citizenship status";
    } else if (formData.isPrOrCitizen === "yes" && !formData.prOrCitizenType) {
      newErrors.prOrCitizenType = "Please specify citizenship type";
    } else if (formData.isPrOrCitizen === "no" && !formData.workAuthType) {
      newErrors.workAuthType = "Please specify work authorization type";
    }

    // File upload validation
    if (
      formData.workAuthType === "F1(CPT/OPT)" &&
      !uploadedFiles.optReceiptDocId
    ) {
      newErrors.optReceiptDocId =
        "OPT Receipt is required for F1(CPT/OPT) work authorization";
    }

    // Emergency contacts validation
    formData.emergencyContact.forEach((contact, index) => {
      if (
        !contact.firstName ||
        !contact.lastName ||
        !contact.phone ||
        !contact.relationship
      ) {
        newErrors[`emergency_contact_${index}`] =
          "Emergency contact must have first name, last name, phone, and relationship";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { handleSubmit, handleSaveDraft } = useOnboardingForm({
    user,
    employee,
    formData,
    uploadedFiles,
    setErrors,
    setMessage,
    setSubmitting,
    setSavingDraft,
  });

  if (loading) {
    return (
      <div className="onboarding-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  // Check user access and determine UI state
  const isOnboardingStage = employee?.stage === "onboarding";
  const canEditForm =
    isOnboardingStage &&
    (employee?.status === "never_submit" || employee?.status === "rejected");
  const isPendingState = isOnboardingStage && employee?.status === "pending";

  if (!isOnboardingStage) {
    return (
      <div className="onboarding-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>
            You don't have access to the onboarding application at this time.
          </p>
        </div>
      </div>
    );
  }

  // Render pending state UI
  if (isPendingState) {
    return (
      <div className="onboarding-container">
        <div className="onboarding-header">
          <h1>Employee Onboarding Application</h1>
          <div className="pending-message">
            <h2>Please wait for HR to review your application.</h2>
            <p>
              Your application has been submitted and is currently under review.
            </p>
          </div>
        </div>

        {/* Read-only form display */}
        <div className="readonly-form">
          <div className="form-section">
            <h3>Personal Details</h3>
            <div className="readonly-field-group">
              <div className="readonly-field">
                <label>First Name:</label>
                <span>{formData.firstName}</span>
              </div>
              <div className="readonly-field">
                <label>Last Name:</label>
                <span>{formData.lastName}</span>
              </div>
              <div className="readonly-field">
                <label>Middle Name:</label>
                <span>{formData.middleName || "N/A"}</span>
              </div>
              <div className="readonly-field">
                <label>Preferred Name:</label>
                <span>{formData.preferredName || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Current Address</h3>
            <div className="readonly-field-group">
              <div className="readonly-field">
                <label>Building/Apartment:</label>
                <span>{formData.addressBuilding}</span>
              </div>
              <div className="readonly-field">
                <label>Street Address:</label>
                <span>{formData.addressStreet}</span>
              </div>
              <div className="readonly-field">
                <label>City:</label>
                <span>{formData.addressCity}</span>
              </div>
              <div className="readonly-field">
                <label>State:</label>
                <span>{formData.addressState}</span>
              </div>
              <div className="readonly-field">
                <label>ZIP Code:</label>
                <span>{formData.addressZip}</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="readonly-field-group">
              <div className="readonly-field">
                <label>Cell Phone:</label>
                <span>{formData.cellPhone}</span>
              </div>
              <div className="readonly-field">
                <label>Work Phone:</label>
                <span>{formData.workPhone || "N/A"}</span>
              </div>
              <div className="readonly-field">
                <label>Email:</label>
                <span>{formData.email}</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Identity Information</h3>
            <div className="readonly-field-group">
              <div className="readonly-field">
                <label>SSN:</label>
                <span>{formData.ssn}</span>
              </div>
              <div className="readonly-field">
                <label>Date of Birth:</label>
                <span>{formData.dateOfBirth}</span>
              </div>
              <div className="readonly-field">
                <label>Gender:</label>
                <span>{formData.gender}</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Citizenship/Work Authorization</h3>
            <div className="readonly-field-group">
              <div className="readonly-field">
                <label>Permanent resident or citizen of the U.S.:</label>
                <span>{formData.isPrOrCitizen === "yes" ? "Yes" : "No"}</span>
              </div>
              {formData.isPrOrCitizen === "yes" && (
                <div className="readonly-field">
                  <label>Citizenship Type:</label>
                  <span>{formData.prOrCitizenType}</span>
                </div>
              )}
              {formData.isPrOrCitizen === "no" && (
                <div className="readonly-field">
                  <label>Work Authorization Type:</label>
                  <span>{formData.workAuthType}</span>
                </div>
              )}
            </div>
          </div>

          {/* Document Management Section */}
          <FilesSummary
            uploadedFiles={uploadedFiles}
            onPreview={handleDocumentPreview}
            onDownload={handleDocumentDownload}
          />
        </div>
      </div>
    );
  }

  // Render editable form for never_submit and rejected states
  if (!canEditForm) {
    return (
      <div className="onboarding-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>
            You don't have access to the onboarding application at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <h1>Employee Onboarding Application</h1>
        <p>
          Please complete all required information to proceed with your
          onboarding.
        </p>
      </div>

      {/* HR Feedback for rejected status */}
      {employee?.status === "rejected" && employee?.feedback && (
        <div className="feedback-alert">
          <h3>HR Feedback</h3>
          <p>{employee.feedback}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="onboarding-form">
        {/* Personal Details Section */}
        <PersonalDetailsSection
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onUploadSuccess={handleFileUploadSuccess}
          onUploadError={handleFileUploadError}
        />

        {/* Address Section */}
        <AddressSection
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
        />

        <ContactInfoSection
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onUploadSuccess={handleFileUploadSuccess}
          onUploadError={handleFileUploadError}
        />

        <IdentitySection
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
        />

        {/* Citizenship/Work Authorization Section */}
        <WorkAuthSection
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onUploadSuccess={handleFileUploadSuccess}
          onUploadError={handleFileUploadError}
        />

        {/* Reference Section */}
        <ReferenceSection formData={formData} onChange={handleInputChange} />

        {/* Emergency Contacts Section */}
        <EmergencyContactsSection
          contacts={formData.emergencyContact}
          errors={errors}
          onChange={handleEmergencyContactChange}
          onAdd={addEmergencyContact}
          onRemove={removeEmergencyContact}
        />

        {/* Submit Button */}
        <div className="form-section">
          {message && (
            <div
              className={`message ${
                message.includes("successful") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <div className="button-group">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="save-draft-btn"
              disabled={savingDraft || submitting}
            >
              {savingDraft ? "Saving Draft..." : "Save Draft"}
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting || savingDraft}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OnboardingApplicationPage;
