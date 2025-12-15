import React from "react";
import { ServiceRequest } from "../types/serviceRequest";

interface Props {
  request: ServiceRequest | null;
  onClose: () => void;
}

const ModalServiceRequest: React.FC<Props> = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <div className={`modal active`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>{request.businessName}</h2>
            <span className="service-badge">{request.requestedService}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Business Info */}
        <div className="modal-section">
          <h3>Business Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-item-label">Owner</span>
              <span className="info-item-value">{request.owner}</span>
            </div>
            <div className="info-item">
              <span className="info-item-label">Location</span>
              <span className="info-item-value">{request.location}</span>
            </div>
            <div className="info-item">
              <span className="info-item-label">Existing Services</span>
              <span className="info-item-value">{request.existingServices.join(", ")}</span>
            </div>
            <div className="info-item">
              <span className="info-item-label">Submitted</span>
              <span className="info-item-value">{request.submitted}</span>
            </div>
          </div>
        </div>

        {/* Request Details */}
        <div className="modal-section">
          <h3>Request Details</h3>
          <div className="description-full">
            <p>
              <strong>Requested Service:</strong> {request.requestedService}
            </p>
            <p>
              <strong>Reason:</strong> {request.reason}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button className="btn-large btn-approve-large">Approve Request</button>
          <button className="btn-large btn-reject-large">Reject Request</button>
        </div>
      </div>
    </div>
  );
};

export default ModalServiceRequest;
