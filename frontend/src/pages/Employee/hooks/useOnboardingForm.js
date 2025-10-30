import { useCallback } from 'react';
import { submitEmployeerInfo, saveDraftEmployeerInfo } from '../../../api/auth';

export const useOnboardingForm = ({
  user,
  employee,
  formData,
  uploadedFiles,
  setErrors,
  setMessage,
  setSubmitting,
  setSavingDraft,
}) => {
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required fields 
    const requiredFields = ['first_name', 'last_name', 'address_building', 'address_street', 'address_city', 'address_state', 'address_zip', 'cell_phone', 'ssn', 'date_of_birth', 'gender'];
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = 'This field is required';
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
    (formData.emergency_contacts || []).forEach((contact, index) => {
      if (!contact.first_name || !contact.last_name || !contact.phone || !contact.relationship) {
        newErrors[`emergency_contact_${index}`] = 'Emergency contact must have first name, last name, phone, and relationship';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, uploadedFiles, setErrors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const employeeId = user?.id || employee?.id;
      if (!employeeId) throw new Error('Employee ID not found');

      const submissionData = {
        ...formData,
        profile_picture_ref: uploadedFiles.profilePictureDocId,
        driver_license_ref: uploadedFiles.driverLicenseDocId,
        opt_receipt_upload_ref: uploadedFiles.optReceiptDocId,
      };
      delete submissionData.profile_picture;
      delete submissionData.opt_receipt;

      await submitEmployeerInfo(employeeId, submissionData);
      setMessage('Application submitted successfully! Redirecting...');
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setMessage(`Submission failed: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  }, [validateForm, setMessage, setSubmitting, user, employee, formData, uploadedFiles]);

  const handleSaveDraft = useCallback(async () => {
    setMessage('');
    setSavingDraft(true);
    try {
      const employeeId = user?.id || employee?.id;
      if (!employeeId) throw new Error('Employee ID not found');

      const draftData = {
        ...formData,
        profile_picture_ref: uploadedFiles.profilePictureDocId,
        driver_license_ref: uploadedFiles.driverLicenseDocId,
        opt_receipt_upload_ref: uploadedFiles.optReceiptDocId,
      };
      delete draftData.profile_picture;
      delete draftData.opt_receipt;

      await saveDraftEmployeerInfo(employeeId, draftData);
      setMessage('Draft saved successfully!');
    } catch (error) {
      setMessage(`Failed to save draft: ${error.message || 'Unknown error'}`);
    } finally {
      setSavingDraft(false);
    }
  }, [setMessage, setSavingDraft, user, employee, formData, uploadedFiles]);

  return { handleSubmit, handleSaveDraft };
};


