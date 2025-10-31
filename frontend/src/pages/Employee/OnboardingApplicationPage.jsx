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
import EmployeeNav from "../../components/EmployeeNav";

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
              workAuthDocId: employeeData.workAuthDoc,
              optReceiptDocId: employeeData.optReceipt,
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
    const { name, value, type, files, validity } = e.target;

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

    // Inline validation for specific fields
    setErrors((prev) => {
      const next = { ...prev };
      // SSN: exactly 9 digits
      if (name === "ssn") {
        const digits = (value || "").replace(/\D/g, "");
        next.ssn = /^\d{9}$/.test(digits) ? "" : "SSN must be exactly 9 digits";
      } else if (name === "dateOfBirth" && value) {
        // Native min validation (prevents 0011 etc.)
        if (validity && validity.rangeUnderflow) {
          next.dateOfBirth = "Date of birth must be after 1900-01-01.";
          return next;
        }
        // Past date; age: 0–120 years
        const dob = new Date(value);
        const today = new Date();
        const dobDay = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
        const todayDay = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        const minDob = new Date(1900, 0, 1);
        if (dobDay < minDob) {
          next.dateOfBirth = "Date of birth must be after 1900-01-01.";
          return next;
        }
        if (dobDay >= todayDay) {
          next.dateOfBirth = "Please enter a past date.";
        } else {
          const age = (todayDay - dobDay) / (1000 * 60 * 60 * 24 * 365.25);
          if (age > 120 || age <= 0) {
            next.dateOfBirth = "Please enter a valid age.";
          } else {
            next.dateOfBirth = "";
          }
        }
      } else if (name === "isPrOrCitizen") {
        if (value === "yes") {
          // Clear work auth related fields when switching to citizen/PR
          next.workAuthType = "";
          next.visaTitle = "";
          next.visaStartDate = "";
          next.visaEndDate = "";
          // Clear any related errors
          next.workAuthType = "";
          next.workAuthDocId = "";
          next.optReceiptDocId = "";
        }
      } else if ((name === "visaStartDate" || name === "visaEndDate") &&
                 formData.isPrOrCitizen === "no" && formData.workAuthType) {
        const start = name === "visaStartDate" ? value : formData.visaStartDate;
        const end = name === "visaEndDate" ? value : formData.visaEndDate;
        const minDate = new Date(1900, 0, 1);
        if ((start && new Date(start) < minDate) || (end && new Date(end) < minDate) || (validity && validity.rangeUnderflow)) {
          next.visaStartDate = "Dates must be after 1900-01-01";
        } else if (start && end && new Date(start) > new Date(end)) {
          next.visaEndDate = "End date cannot be earlier than start date";
        } else {
          next.visaStartDate = "";
          next.visaEndDate = "";
        }
      } else if (name in next) {
        // clear generic field error on typing
        next[name] = "";
      }
      return next;
    });
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
        <EmployeeNav active="visa" />
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

          {/* Reference Section (readonly after submit) */}
          <div className="form-section">
            <h3>Reference</h3>
            <div className="readonly-field-group">
              <div className="readonly-field">
                <label>First Name:</label>
                <span>{formData.referenceFirstName || "N/A"}</span>
              </div>
              <div className="readonly-field">
                <label>Last Name:</label>
                <span>{formData.referenceLastName || "N/A"}</span>
              </div>
              <div className="readonly-field">
                <label>Middle Name:</label>
                <span>{formData.referenceMiddleName || "N/A"}</span>
              </div>
              <div className="readonly-field">
                <label>Phone:</label>
                <span>{formData.referencePhone || "N/A"}</span>
              </div>
              <div className="readonly-field">
                <label>Email:</label>
                <span>{formData.referenceEmail || "N/A"}</span>
              </div>
              <div className="readonly-field">
                <label>Relationship:</label>
                <span>{formData.referenceRelationship || "N/A"}</span>
              </div>
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
        <ReferenceSection formData={formData} errors={errors} onChange={handleInputChange} />

        {/* Emergency Contacts Section */}
        <EmergencyContactsSection
          contacts={formData.emergencyContact}
          errors={errors}
          onChange={handleEmergencyContactChange}
          onAdd={addEmergencyContact}
          onRemove={removeEmergencyContact}
        />

        {/* Summary of Uploaded Files or Documents */}
        <FilesSummary
          uploadedFiles={uploadedFiles}
          onPreview={handleDocumentPreview}
          onDownload={handleDocumentDownload}
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
