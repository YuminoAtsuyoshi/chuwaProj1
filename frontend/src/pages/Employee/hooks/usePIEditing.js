import { useState, useCallback } from 'react';
import { saveDraftEmployeerInfo } from '../../../api/auth';

export const usePIEditing = ({ user, employeerInfo, setEmployeerInfo, setMessage }) => {
  const [saving, setSaving] = useState(false);
  const [editModes, setEditModes] = useState({ name: false, address: false, contact: false, identity: false });
  const [tempData, setTempData] = useState({});

  const handleEdit = useCallback((section) => {
    setEditModes((prev) => ({ ...prev, [section]: true }));
    if (section === 'name') {
      setTempData({
        first_name: employeerInfo?.first_name || '',
        last_name: employeerInfo?.last_name || '',
        middle_name: employeerInfo?.middle_name || '',
        preferred_name: employeerInfo?.preferred_name || '',
      });
    } else if (section === 'address') {
      setTempData({
        address_building: employeerInfo?.address_building || '',
        address_street: employeerInfo?.address_street || '',
        address_city: employeerInfo?.address_city || '',
        address_state: employeerInfo?.address_state || '',
        address_zip: employeerInfo?.address_zip || '',
      });
    } else if (section === 'contact') {
      setTempData({ cell_phone: employeerInfo?.cell_phone || '', work_phone: employeerInfo?.work_phone || '' });
    } else if (section === 'identity') {
      setTempData({ ssn: employeerInfo?.ssn || '', date_of_birth: employeerInfo?.date_of_birth || '', gender: employeerInfo?.gender || '' });
    }
  }, [employeerInfo]);

  const handleSave = useCallback(async (section) => {
    setSaving(true);
    setMessage?.('');
    try {
      const employeeId = user?.id;
      if (!employeeId) throw new Error('Employee ID not found');

      const updatedData = { ...employeerInfo, ...tempData };

      if (section === 'name' && (!tempData.first_name || !tempData.last_name)) throw new Error('First name and last name are required');
      if (section === 'address' && (!tempData.address_building || !tempData.address_street || !tempData.address_city || !tempData.address_state || !tempData.address_zip)) throw new Error('All address fields are required');
      if (section === 'contact' && !tempData.cell_phone) throw new Error('Cell phone is required');
      if (section === 'identity' && (!tempData.ssn || !tempData.date_of_birth || !tempData.gender)) throw new Error('SSN, date of birth, and gender are required');

      await saveDraftEmployeerInfo(employeeId, updatedData);
      setEmployeerInfo(updatedData);
      setEditModes((prev) => ({ ...prev, [section]: false }));
      setMessage?.('Changes saved successfully!');
      setTimeout(() => setMessage?.(''), 3000);
    } catch (error) {
      setMessage?.(`Failed to save changes: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  }, [user?.id, employeerInfo, tempData, setEmployeerInfo, setMessage]);

  const handleCancel = useCallback((section) => {
    let hasChanges = false;
    if (section === 'name') {
      hasChanges = tempData.first_name !== employeerInfo?.first_name || tempData.last_name !== employeerInfo?.last_name || tempData.middle_name !== employeerInfo?.middle_name || tempData.preferred_name !== employeerInfo?.preferred_name;
    } else if (section === 'address') {
      hasChanges = tempData.address_building !== employeerInfo?.address_building || tempData.address_street !== employeerInfo?.address_street || tempData.address_city !== employeerInfo?.address_city || tempData.address_state !== employeerInfo?.address_state || tempData.address_zip !== employeerInfo?.address_zip;
    } else if (section === 'contact') {
      hasChanges = tempData.cell_phone !== employeerInfo?.cell_phone || tempData.work_phone !== employeerInfo?.work_phone;
    } else if (section === 'identity') {
      hasChanges = tempData.ssn !== employeerInfo?.ssn || tempData.date_of_birth !== employeerInfo?.date_of_birth || tempData.gender !== employeerInfo?.gender;
    }
    if (hasChanges) {
      const confirmed = window.confirm('Do you want to discard all of your changes?');
      if (!confirmed) return;
    }
    setEditModes((prev) => ({ ...prev, [section]: false }));
    setTempData({});
  }, [tempData, employeerInfo]);

  const handleInputChange = useCallback((field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  }, []);

  return { saving, editModes, tempData, handleEdit, handleSave, handleCancel, handleInputChange };
};


