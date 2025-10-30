import React from 'react';
import PISectionCard from './PISectionCard';
import { US_STATES } from '../../../../constants/states';

const AddressSectionPI = ({ employeerInfo, isEditing, onEdit, onSave, onCancel, saving, tempData, onChange }) => {
  return (
    <PISectionCard
      title="Address"
      isEditing={isEditing}
      onEdit={onEdit}
      onSave={onSave}
      onCancel={onCancel}
      saving={saving}
      childrenReadOnly={(
        <>
          <div className="field"><label>Building/Apartment:</label><span>{employeerInfo.address_building || 'N/A'}</span></div>
          <div className="field"><label>Street Address:</label><span>{employeerInfo.address_street || 'N/A'}</span></div>
          <div className="field"><label>City:</label><span>{employeerInfo.address_city || 'N/A'}</span></div>
          <div className="field"><label>State:</label><span>{employeerInfo.address_state || 'N/A'}</span></div>
          <div className="field"><label>ZIP Code:</label><span>{employeerInfo.address_zip || 'N/A'}</span></div>
        </>
      )}
      childrenEdit={(
        <>
          <div className="field"><label>Building/Apartment *</label><input type="text" value={tempData.address_building} onChange={(e) => onChange('address_building', e.target.value)} /></div>
          <div className="field"><label>Street Address *</label><input type="text" value={tempData.address_street} onChange={(e) => onChange('address_street', e.target.value)} /></div>
          <div className="field"><label>City *</label><input type="text" value={tempData.address_city} onChange={(e) => onChange('address_city', e.target.value)} /></div>
          <div className="field"><label>State *</label>
            <select value={tempData.address_state} onChange={(e) => onChange('address_state', e.target.value)}>
              <option value="">Select State</option>
              {US_STATES.map(code => (<option key={code} value={code}>{code}</option>))}
            </select>
          </div>
          <div className="field"><label>ZIP Code *</label><input type="text" value={tempData.address_zip} onChange={(e) => onChange('address_zip', e.target.value)} /></div>
        </>
      )}
    />
  );
};

export default AddressSectionPI;


