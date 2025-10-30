import React from 'react';
import PISectionCard from './PISectionCard';

const NameSection = ({ employeerInfo, isEditing, onEdit, onSave, onCancel, saving, tempData, onChange }) => {
  return (
    <PISectionCard
      title="Name"
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
      saving={saving}
      childrenReadOnly={(
        <>
          <div className="field"><label>First Name:</label><span>{employeerInfo.first_name || 'N/A'}</span></div>
          <div className="field"><label>Last Name:</label><span>{employeerInfo.last_name || 'N/A'}</span></div>
          <div className="field"><label>Middle Name:</label><span>{employeerInfo.middle_name || 'N/A'}</span></div>
          <div className="field"><label>Preferred Name:</label><span>{employeerInfo.preferred_name || 'N/A'}</span></div>
        </>
      )}
      childrenEdit={(
        <>
          <div className="field"><label>First Name *</label><input type="text" value={tempData.first_name} onChange={(e) => onChange('first_name', e.target.value)} /></div>
          <div className="field"><label>Last Name *</label><input type="text" value={tempData.last_name} onChange={(e) => onChange('last_name', e.target.value)} /></div>
          <div className="field"><label>Middle Name</label><input type="text" value={tempData.middle_name} onChange={(e) => onChange('middle_name', e.target.value)} /></div>
          <div className="field"><label>Preferred Name</label><input type="text" value={tempData.preferred_name} onChange={(e) => onChange('preferred_name', e.target.value)} /></div>
        </>
      )}
    />
  );
};

export default NameSection;


