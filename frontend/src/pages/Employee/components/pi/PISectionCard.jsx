import React from 'react';

const PISectionCard = ({
  title,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  saving,
  childrenReadOnly,
  childrenEdit,
}) => {
  return (
    <div className="info-section">
      <div className="section-header">
        <h3>{title}</h3>
        {!isEditing && (
          <button onClick={onEdit} className="edit-btn">Edit</button>
        )}
        {isEditing && (
          <div className="action-buttons">
            <button onClick={onSave} className="save-btn" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={onCancel} className="cancel-btn" disabled={saving}>
              Cancel
            </button>
          </div>
        )}
      </div>
      <div className="section-content">
        {!isEditing ? (
          <div className="readonly-fields">{childrenReadOnly}</div>
        ) : (
          <div className="editable-fields">{childrenEdit}</div>
        )}
      </div>
    </div>
  );
};

export default PISectionCard;


