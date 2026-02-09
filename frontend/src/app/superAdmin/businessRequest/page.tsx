"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "../../../components/StatCard";
import BusinessRequestCard from "../../../components/BusinessRequestCard";
import ModalBusinessDetails from "../../../components/ModalBusinessDetails";
import "../../../styles/superadminDash.css";

/* ✅ Type now MATCHES backend */
export interface BusinessRequest {
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
        const res = await axios.get(
          "http://localhost:8080/api/business/getPendingBusiness"
        );

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
      } catch (err) {
        console.error("Failed to fetch businesses", err);
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
          {requests.map((req, index) => (
            <BusinessRequestCard
              key={req.userId}
              request={{
                id: req.userId,
                name: req.businessName,
                owner: req.ownerName,
                email: req.email,
                contact: req.contactNumber,
                location: `${req.city ?? ""} ${req.businessAddress ?? ""}`,
                serviceType: req.category?.join(", ") ?? "",
                pan: req.panNumber ?? "",
                submitted: "",
                description: req.description ?? "",
                documents: [],
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
