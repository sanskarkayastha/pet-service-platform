import React, { useState } from "react";
import { BusinessRequest } from "../types/businessRequest";
import "../styles/superadminDash.css";

interface Props {
  request: BusinessRequest;
  onView: (req: BusinessRequest) => void;
}

const BusinessRequestCard: React.FC<Props> = ({ request, onView }) => {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const businessId = request.businessId ?? request.id;

  // 🔹 Approve API
  const handleApprove = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token = await (await import("@/lib/auth-client")).authClient.token();
      await fetch(`${baseUrl}/api/business/${businessId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      setShowApproveModal(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to approve business");
    }
  };

  // 🔹 Reject API
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token = await (await import("@/lib/auth-client")).authClient.token();
      await fetch(`${baseUrl}/api/business/${businessId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: rejectReason }),
      });
      setShowRejectModal(false);
      setRejectReason("");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to reject business");
    }
  };

  return (
    <>
      <div className="request-card" onClick={() => onView(request)}>
        <div className="card-top">
          <div className="card-info">
            <h3>{request.name}</h3>
            <span className="service-badge">{request.serviceType}</span>
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
            onClick={(e) => {
              e.stopPropagation();
              setShowApproveModal(true);
            }}
          >
            Approve
          </button>

          <button
            className="btn-small btn-reject-small"
            onClick={(e) => {
              e.stopPropagation();
              setShowRejectModal(true);
            }}
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

      {/* 🟢 APPROVE MODAL */}
      {showApproveModal && (
        <div className="modal-overlay">
          <div className="action-modal">
            <h3>Request Approved ✅</h3>
            <p>The business request has been approved successfully.</p>
            <button onClick={handleApprove}>OK</button>
          </div>
        </div>
      )}

      {/* 🔴 REJECT MODAL */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="action-modal">
            <h3>Decline Business Request ❌</h3>

            <textarea
              placeholder="Write reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button onClick={handleReject}>OK</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default BusinessRequestCard;
