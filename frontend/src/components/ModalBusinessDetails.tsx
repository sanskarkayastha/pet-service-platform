"use client";

import React from "react";
import { BusinessRequest } from "../types/businessRequest";
import "../styles/superadminDash.css";

interface Props {
  request: BusinessRequest | null;
  onClose: () => void;
}

const ModalBusinessDetails: React.FC<Props> = ({ request, onClose }) => {
  if (!request) return null;

  return (
    <div className={`modal active`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2>{request.name}</h2>
            <span className="service-badge">{request.serviceType}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-section">
          <h3>Business Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-item-label">Owner Full Name</span>
              <span className="info-item-value">{request.owner}</span>
            </div>
            <div className="info-item">
              <span className="info-item-label">Email Address</span>
              <span className="info-item-value">{request.email}</span>
            </div>
            <div className="info-item">
              <span className="info-item-label">Contact Number</span>
              <span className="info-item-value">{request.contact}</span>
            </div>
            <div className="info-item">
              <span className="info-item-label">Business Address</span>
              <span className="info-item-value">{request.location}</span>
            </div>
            <div className="info-item">
              <span className="info-item-label">PAN Number</span>
              <span className="info-item-value">{request.pan}</span>
            </div>
            <div className="info-item">
              <span className="info-item-label">Registration Date</span>
              <span className="info-item-value">{request.submitted}</span>
            </div>
          </div>
        </div>

        <div className="modal-section">
          <h3>Business Description</h3>
          <div className="description-full">{request.description}</div>
        </div>

        <div className="modal-section">
          <h3>Documents & Certifications</h3>
          <div className="documents-grid">
            {request.documents.map((doc, idx) => (
              <div key={idx} className="doc-card">
                <div className="doc-icon">{doc.icon || "📄"}</div>
                <div className="doc-name">{doc.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-large btn-approve-large">Approve Business</button>
          <button className="btn-large btn-reject-large">Reject Request</button>
        </div>
      </div>
    </div>
  );
};

export default ModalBusinessDetails;
