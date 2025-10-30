import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getEmployeeDetails, getEmployeerInfo } from '../../api/auth';
import { logout } from '../../store';
import FileUpload from '../../components/FileUpload';
import FilesSummary from './components/FilesSummary';
import WorkAuthSection from './components/WorkAuthSection';
import ReferenceSection from './components/ReferenceSection';
import EmergencyContactsSection from './components/EmergencyContactsSection';
import { useFileUpload } from './hooks/useFileUpload';
import { useOnboardingForm } from './hooks/useOnboardingForm';
import ContactInfoSection from './components/ContactInfoSection';
import IdentitySection from './components/IdentitySection';
import PersonalDetailsSection from './components/PersonalDetailsSection';
import AddressSection from './components/AddressSection';
import './OnboardingApplicationPage.css';

const OnboardingApplicationPage = () => {
  const [employee, setEmployee] = useState(null);
  const [employeerInfo, setEmployeerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [message, setMessage] = useState('');
  
  // File upload state and handlers
  const {
    uploadedFiles,
    handleFileUploadSuccess,
    handleFileUploadError,
    handleDocumentDownload,
    handleDocumentPreview,
  } = useFileUpload({ setErrors, setMessage });
  
  // Get user data from Redux store
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Form state
  const [formData, setFormData] = useState({
    // Personal Details
    first_name: '',
    last_name: '',
    middle_name: '',
    preferred_name: '',
    profile_picture: null,
    
    // Address
    address_building: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zip: '',
    
    // Contact Info
    cell_phone: '',
    work_phone: '',
    email: '',
    
    // Identity
    ssn: '',
    date_of_birth: '',
    gender: '',
    
    // Citizenship/Work Authorization
    is_pr_or_citizen: '',
    pr_or_citizen_type: '',
    work_auth_type: '',
    opt_receipt: null,
    visa_title: '',
    visa_start_date: '',
    visa_end_date: '',
    
    // Reference
    reference_first_name: '',
    reference_last_name: '',
    reference_middle_name: '',
    reference_phone: '',
    reference_email: '',
    reference_relationship: '',
    
    // Emergency Contacts
    emergency_contacts: [
      {
        first_name: '',
        last_name: '',
        middle_name: '',
        phone: '',
        email: '',
        relationship: ''
      }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      // Check for test user data first (for testing without backend)
      const testUser = localStorage.getItem('testUser');
      if (testUser) {
        try {
          const testUserData = JSON.parse(testUser);
          setEmployee(testUserData);
          setFormData(prev => ({
            ...prev,
            email: testUserData.email || ''
          }));
          
          // Handle approved status redirection
          if (testUserData.stage === 'onboarding' && testUserData.status === 'approved') {
            navigate('/employee/dashboard');
            return;
          }
          
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing test user data:', error);
        }
      }
      
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch employee details
        const employeeData = await getEmployeeDetails(user.id);
        setEmployee(employeeData);
        
        // Handle approved status redirection
        if (employeeData.stage === 'onboarding' && employeeData.status === 'approved') {
          navigate('/employee/dashboard');
          return;
        }
        
        // Pre-fill email from employee data
        setFormData(prev => ({
          ...prev,
          email: employeeData.email || ''
        }));
        
        // Try to fetch existing employeer info
        try {
          const employeerData = await getEmployeerInfo(user.id);
          setEmployeerInfo(employeerData);
          
          // Pre-fill form with existing data
          if (employeerData) {
            setFormData(prev => ({
              ...prev,
              ...employeerData,
              // Handle emergency contacts array
              emergency_contacts: employeerData.emergency_contacts || [{
                first_name: '',
                last_name: '',
                middle_name: '',
                phone: '',
                email: '',
                relationship: ''
              }]
            }));
            
            // Set uploaded file IDs for document management
            setUploadedFiles(prev => ({
              ...prev,
              profilePictureDocId: employeerData.profile_picture_ref,
              driverLicenseDocId: employeerData.driver_license_ref,
              optReceiptDocId: employeerData.opt_receipt_upload_ref
            }));
          }
        } catch (error) {
          // No existing employeer info found, that's okay
          console.log('No existing employeer info found');
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // File upload handlers moved to useFileUpload hook

  const handleEmergencyContactChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      emergency_contacts: prev.emergency_contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergency_contacts: [
        ...prev.emergency_contacts,
        {
          first_name: '',
          last_name: '',
          middle_name: '',
          phone: '',
          email: '',
          relationship: ''
        }
      ]
    }));
  };

  const removeEmergencyContact = (index) => {
    if (formData.emergency_contacts.length > 1) {
      setFormData(prev => ({
        ...prev,
        emergency_contacts: prev.emergency_contacts.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = [
      'first_name', 'last_name', 'address_building', 'address_street',
      'address_city', 'address_state', 'address_zip', 'cell_phone',
      'ssn', 'date_of_birth', 'gender'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace('_', ' ')} is required`;
      }
    });
    
    // Citizenship/Work Authorization validation
    if (!formData.is_pr_or_citizen) {
      newErrors.is_pr_or_citizen = 'Please specify citizenship status';
    } else if (formData.is_pr_or_citizen === 'yes' && !formData.pr_or_citizen_type) {
      newErrors.pr_or_citizen_type = 'Please specify citizenship type';
    } else if (formData.is_pr_or_citizen === 'no' && !formData.work_auth_type) {
      newErrors.work_auth_type = 'Please specify work authorization type';
    }
    
    // File upload validation
    if (formData.work_auth_type === 'F1(CPT/OPT)' && !uploadedFiles.optReceiptDocId) {
      newErrors.optReceiptDocId = 'OPT Receipt is required for F1(CPT/OPT) work authorization';
    }
    
    // Emergency contacts validation
    formData.emergency_contacts.forEach((contact, index) => {
      if (!contact.first_name || !contact.last_name || !contact.phone || !contact.relationship) {
        newErrors[`emergency_contact_${index}`] = 'Emergency contact must have first name, last name, phone, and relationship';
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
  const isOnboardingStage = employee?.stage === 'onboarding';
  const canEditForm = isOnboardingStage && (employee?.status === 'never_submit' || employee?.status === 'rejected');
  const isPendingState = isOnboardingStage && employee?.status === 'pending';

  if (!isOnboardingStage) {
    return (
      <div className="onboarding-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have access to the onboarding application at this time.</p>
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
            <p>Your application has been submitted and is currently under review.</p>
          </div>
        </div>

        {/* Read-only form display */}
        <div className="readonly-form">
          <div className="form-section">
            <h3>Personal Details</h3>
            <div className="readonly-field-group">
              <div className="readonly-field">
                <label>First Name:</label>
                <span>{formData.first_name}</span>
              </div>
              <div className="readonly-field">
                <label>Last Name:</label>
                <span>{formData.last_name}</span>
              </div>
              <div className="readonly-field">
                <label>Middle Name:</label>
                <span>{formData.middle_name || 'N/A'}</span>
              </div>
              <div className="readonly-field">
                <label>Preferred Name:</label>
                <span>{formData.preferred_name || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Current Address</h3>
            <div className="readonly-field-group">
              <div className="readonly-field">
                <label>Building/Apartment:</label>
                <span>{formData.address_building}</span>
              </div>
              <div className="readonly-field">
                <label>Street Address:</label>
                <span>{formData.address_street}</span>
              </div>
              <div className="readonly-field">
                <label>City:</label>
                <span>{formData.address_city}</span>
              </div>
              <div className="readonly-field">
                <label>State:</label>
                <span>{formData.address_state}</span>
              </div>
              <div className="readonly-field">
                <label>ZIP Code:</label>
                <span>{formData.address_zip}</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="readonly-field-group">
              <div className="readonly-field">
                <label>Cell Phone:</label>
                <span>{formData.cell_phone}</span>
              </div>
              <div className="readonly-field">
                <label>Work Phone:</label>
                <span>{formData.work_phone || 'N/A'}</span>
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
                <span>{formData.date_of_birth}</span>
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
                <span>{formData.is_pr_or_citizen === 'yes' ? 'Yes' : 'No'}</span>
              </div>
              {formData.is_pr_or_citizen === 'yes' && (
                <div className="readonly-field">
                  <label>Citizenship Type:</label>
                  <span>{formData.pr_or_citizen_type}</span>
                </div>
              )}
              {formData.is_pr_or_citizen === 'no' && (
                <div className="readonly-field">
                  <label>Work Authorization Type:</label>
                  <span>{formData.work_auth_type}</span>
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
          <p>You don't have access to the onboarding application at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <h1>Employee Onboarding Application</h1>
        <p>Please complete all required information to proceed with your onboarding.</p>
      </div>

      {/* HR Feedback for rejected status */}
      {employee?.status === 'rejected' && employee?.feedback && (
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
        <AddressSection formData={formData} errors={errors} onChange={handleInputChange} />

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
          contacts={formData.emergency_contacts}
          errors={errors}
          onChange={handleEmergencyContactChange}
          onAdd={addEmergencyContact}
          onRemove={removeEmergencyContact}
        />

        {/* Submit Button */}
        <div className="form-section">
          {message && (
            <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
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
              {savingDraft ? 'Saving Draft...' : 'Save Draft'}
            </button>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting || savingDraft}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OnboardingApplicationPage;
