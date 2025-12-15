"use client";

import React, { useState } from "react";
import SuperAdminSidebar from "../../../components/SuperAdminSidebar";
import StatCard from "../../../components/StatCard";
import ServiceRequestCard from "../../../components/ServiceRequestCard";
import ModalServiceRequest from "../../../components/ModalServiceRequest";
import { ServiceRequest } from "../../../types/serviceRequest";
import "../../../styles/superadminDash.css";

// Mock data
const requestsData: ServiceRequest[] = [
  {
    id: 1,
    businessId: 101,
    businessName: "Paws & Claws Grooming",
    owner: "Sarah Johnson",
    requestedService: "Pet Spa",
    existingServices: ["Grooming", "Nail Trimming"],
    location: "Thamel, Kathmandu",
    submitted: "Dec 12, 2025",
    reason: "We want to expand our services for luxury pet care."
  },
  {
    id: 2,
    businessId: 102,
    businessName: "Happy Pets Hostel",
    owner: "Anushka",
    requestedService: "Dog Walking",
    existingServices: ["Pet Hostel", "Pet Sitting"],
    location: "Lalitpur",
    submitted: "Dec 11, 2025",
    reason: "Many clients requested daily dog walking service."
  },
];

const ServiceRequestsPage: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  return (
    <>
      {/* Sidebar */}
      <SuperAdminSidebar />

      {/* Main content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <h1>Service Requests</h1>
          <div className="search-filter">
            <div className="search-box">
              <input type="text" placeholder="Search service requests..." />
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
          <StatCard number={requestsData.length} label="Pending Requests" />
          <StatCard number={0} label="Approved" />
          <StatCard number={0} label="Rejected" />
          <StatCard number={requestsData.length} label="Total Requests" />
        </div>

        {/* Requests Grid */}
        <div className="requests-grid">
          {requestsData.map((req) => (
            <ServiceRequestCard
              key={req.id}
              request={req}
              onView={setSelectedRequest}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <ModalServiceRequest
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </>
  );
};

export default ServiceRequestsPage;
