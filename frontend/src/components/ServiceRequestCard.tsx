import React from "react";
import { ServiceRequest } from "../types/serviceRequest";

interface Props {
  request: ServiceRequest;
  onView: (request: ServiceRequest) => void;
}

const ServiceRequestCard: React.FC<Props> = ({ request, onView }) => {
  return (
    <div className="request-card" onClick={() => onView(request)}>
      <div className="card-top">
        <div className="card-info">
          <h3>{request.businessName}</h3>
          <span className="service-badge">{request.requestedService}</span>
        </div>
      </div>

      <div className="card-details">
        <div className="detail-row">
          <span className="detail-label">Owner</span>
          <span className="detail-value">{request.owner}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Location</span>
          <span className="detail-value">{request.location}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Submitted</span>
          <span className="detail-value">{request.submitted}</span>
        </div>
      </div>

      <div className="card-actions">
        <button
          className="btn-small btn-approve-small"
          onClick={(e) => e.stopPropagation()}
        >
          Approve
        </button>
        <button
          className="btn-small btn-reject-small"
          onClick={(e) => e.stopPropagation()}
        >
          Reject
        </button>
        <button
          className="btn-small btn-view-small"
          onClick={(e) => {
            e.stopPropagation();
            onView(request);
          }}
        >
          View
        </button>
      </div>
    </div>
  );
};

export default ServiceRequestCard;
