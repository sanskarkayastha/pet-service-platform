"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import StatCard from "../../../components/StatCard";
import BusinessRequestCard from "../../../components/BusinessRequestCard";
import ModalBusinessDetails from "../../../components/ModalBusinessDetails";
import "../../../styles/superadminDash.css";

/* ✅ Type now MATCHES backend */
export interface BusinessRequest {
  id?: number;
  userId: string;
  businessName: string;
  ownerName: string;
  email: string;
  contactNumber: string;
  businessAddress?: string;
  description?: string;
  city?: string;
  panNumber?: string;
  category?: string[];
  imageUrl?: string;
}

const BusinessRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<BusinessRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  useEffect(() => {
    const getPendingBusiness = async () => {
      try {
        // Debug: Check if token is available
        // Use authenticated API client - automatically adds JWT token
        const res = await apiClient.get("/api/business/getPendingBusiness");

        // axios automatically gives data
        const data = res.data;
        console.log(data)
        // safety check in case backend wraps response
        if (Array.isArray(data)) {
          setRequests(data);
        } else if (Array.isArray(data.content)) {
          setRequests(data.content);
        } else {
          setRequests([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch businesses", err);
        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
          if (err.response.status === 403) {
            console.error("403 Forbidden - Check:");
            console.error("1. User role in database should be 'admin'");
            console.error("2. JWT_SECRET must match in frontend and backend");
            console.error("3. User must exist in database");
          }
        }
      }
    };

    getPendingBusiness();
  }, []);

  return (
    <>
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <h1>Business Registration Requests</h1>

          <div className="search-filter">
            <div className="search-box">
              <input type="text" placeholder="Search businesses..." />
            </div>

            <select className="filter-select">
              <option>All Services</option>
              <option>Grooming</option>
              <option>Veterinary</option>
              <option>Pet Hostel</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard number={requests.length} label="Pending Review" />
          <StatCard number={48} label="Approved" />
          <StatCard number={5} label="Rejected" />
          <StatCard number={65} label="Total Requests" />
        </div>

        {/* Business Cards */}
        <div className="requests-grid">
          {requests.map((req) => (
            <BusinessRequestCard
              key={req.userId}
              request={{
                id: req.id ?? req.userId,
                businessId: req.id,
                userId: req.userId,
                name: req.businessName,
                owner: req.ownerName,
                email: req.email,
                contact: req.contactNumber,
                location: `${req.city ?? ""} ${req.businessAddress ?? ""}`.trim(),
                serviceType: req.category?.join(", ") ?? "",
                pan: req.panNumber ?? "",
                submitted: "",
                description: req.description ?? "",
                documents: req.imageUrl ? [{ name: "Business Documents", icon: "📄" }] : [],
              }}
              onView={setSelectedRequest}
            />
          ))}
        </div>
      </div>

      <ModalBusinessDetails
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </>
  );
};

export default BusinessRequestsPage;
