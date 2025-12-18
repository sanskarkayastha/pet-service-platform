"use client";

import React, { useEffect, useState } from "react";
import StatCard from "../../../components/StatCard";
import BusinessRequestCard from "../../../components/BusinessRequestCard";
import ModalBusinessDetails from "../../../components/ModalBusinessDetails";
import { BusinessRequest } from "../../../types/businessRequest";
import "../../../styles/superadminDash.css";

// Mock data
const requestsData: BusinessRequest[] = [
  {
    id: 1,
    name: "Paws & Claws Grooming",
    owner: "Sarah Johnson",
    email: "sarah.j@pawsclaws.com",
    contact: "+977 9841234567",
    location: "Thamel, Kathmandu",
    serviceType: "Grooming Service",
    pan: "123456789",
    submitted: "Dec 8, 2025",
    description:
      "Premium pet grooming services with over 5 years of experience in the industry.",
    documents: [
      { name: "Business Logo" },
      { name: "License Certificate" },
      { name: "Verification Documents" },
    ],
  },
];

const BusinessRequestsPage: React.FC = () => {
  const [selectedRequest, setSelectedRequest] =
    useState<BusinessRequest | null>(null);

  useEffect(
    ()=>{

    }, []
  )  
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
          <StatCard number={12} label="Pending Review" />
          <StatCard number={48} label="Approved" />
          <StatCard number={5} label="Rejected" />
          <StatCard number={65} label="Total Requests" />
        </div>

        {/* Cards */}
        <div className="requests-grid">
          {requestsData.map((req) => (
            <BusinessRequestCard
              key={req.id}
              request={req}
              onView={setSelectedRequest}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <ModalBusinessDetails
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </>
  );
};

export default BusinessRequestsPage;
