import React from 'react';

const ReviewActions = ({
  isPending,
  processing,
  onApprove,
  onOpenReject,
  showRejectModal,
  rejectFeedback,
  setRejectFeedback,
  onReject,
  onCloseReject,
}) => {
  return (
    <>
      {isPending && (
        <div className="action-buttons-section">
          <button onClick={onApprove} className="approve-btn" disabled={processing}>
            ✅ Approve Application
          </button>
          <button onClick={onOpenReject} className="reject-btn" disabled={processing}>
            ❌ Reject Application
          </button>
        </div>
      )}

      {showRejectModal && (
        <div className="modal-overlay" onClick={() => !processing && onCloseReject()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reject Application</h3>
            <div className="modal-body">
              <label htmlFor="feedback">Please provide feedback for rejection:</label>
              <textarea
                id="feedback"
                value={rejectFeedback}
                onChange={(e) => setRejectFeedback(e.target.value)}
                placeholder="Enter rejection feedback..."
                rows={5}
                disabled={processing}
              />
            </div>
            <div className="modal-footer">
              <button onClick={onReject} className="reject-btn" disabled={processing || !rejectFeedback.trim()}>
                {processing ? 'Rejecting...' : 'Confirm Reject'}
              </button>
              <button onClick={onCloseReject} className="cancel-btn" disabled={processing}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewActions;


