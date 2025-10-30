import React from 'react';
import PISectionCard from './PISectionCard';

const ContactSectionPI = ({ employeerInfo, isEditing, onEdit, onSave, onCancel, saving, tempData, onChange }) => {
  return (
    <PISectionCard
      title="Contact Information"
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
      saving={saving}
      childrenReadOnly={(
        <>
          <div className="field"><label>Cell Phone:</label><span>{employeerInfo.cell_phone || 'N/A'}</span></div>
          <div className="field"><label>Work Phone:</label><span>{employeerInfo.work_phone || 'N/A'}</span></div>
          <div className="field"><label>Email:</label><span>{employeerInfo.email || 'N/A'}</span></div>
        </>
      )}
      childrenEdit={(
        <>
          <div className="field"><label>Cell Phone *</label><input type="tel" value={tempData.cell_phone} onChange={(e) => onChange('cell_phone', e.target.value)} /></div>
          <div className="field"><label>Work Phone</label><input type="tel" value={tempData.work_phone} onChange={(e) => onChange('work_phone', e.target.value)} /></div>
          <div className="field"><label>Email</label><input type="email" value={employeerInfo.email} readOnly className="readonly-input" /></div>
        </>
      )}
    />
  );
};

export default ContactSectionPI;


