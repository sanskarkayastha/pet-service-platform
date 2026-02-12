"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "@/styles/Grooming.css";

interface Business {
  id: number;
  userId: string;
  businessName: string;
  ownerName: string;
  email: string;
  contactNumber: string;
  businessAddress: string;
  description: string;
  city: string;
  panNumber: string;
  category: string[];
  imageUrl: string;
}

export default function PetHostelPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [radius, setRadius] = useState(10);
  const [location, setLocation] = useState("Kathmandu");

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBusinessData = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const response = await fetch(`${apiBase}/api/business/allBusinesses`);
        if (!response.ok) {
          throw new Error(`Failed to fetch hostel businesses: ${response.status}`);
        }
        const json: Business[] = await response.json();
        setBusinesses(
          json.filter((b) => (b.category || []).includes("BOARDING")),
        );
      } catch (err) {
        console.error("Failed to fetch hostel businesses", err);
      } finally {
        setLoading(false);
      }
    };

    getBusinessData();
  }, []);

  const filteredBusinesses = businesses.filter((b) =>
    b.businessName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocation("Current Location");
        alert("Location detected! Showing nearby hostels.");
      },
      () => {
        alert("Unable to detect location. Please enter manually.");
      },
    );
  };

  return (
    <div>
      {/* HERO */}
      <section className="heroine">
        <h1>Find the Best Pet Hostels Near You</h1>
      </section>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="search-filter">
          <input
            className="filter-input"
            placeholder="Search for pet hostels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="location-row">
            <input
              className="filter-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button className="detect-location-btn" onClick={detectLocation}>
              📍 Detect
            </button>
          </div>

          <div className="radius-control">
            <span>Radius:</span>
            <input
              type="range"
              min={1}
              max={50}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="radius-slider"
            />
            <span className="radius-value">{radius} km</span>
          </div>

          <button className="btn-primary">Search</button>
        </div>
      </div>

      {/* HOSTEL GRID */}
      <div className="container">
        <div className="services-grid">
          {loading ? (
            <p
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "3rem",
              }}
            >
              Loading hostels...
            </p>
          ) : filteredBusinesses.length === 0 ? (
            <p
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "3rem",
                color: "#888",
              }}
            >
              No pet hostels found.
            </p>
          ) : (
            filteredBusinesses.map((business) => (
              <div className="service-card" key={business.id}>
                <div
                  className="card-image"
                  style={{
                    backgroundImage: business.imageUrl
                      ? `url('${business.imageUrl}')`
                      : "linear-gradient(135deg, #06b6d4, #3b82f6)",
                  }}
                ></div>

                <div className="card-content">
                  <div className="vendor-name">{business.businessName}</div>
                  <div className="description">{business.description}</div>

                  <div className="card-meta">
                    <div>📍 {business.city}</div>
                  </div>

                  <div className="card-footer">
                    <Link
                      href={`/users/petServices/grooming/detail/${business.id}/booking`}
                      className="btn-book"
                    >
                      Book Stay
                    </Link>
                    <Link
                      href={`/users/petServices/grooming/detail/${business.id}`}
                      className="btn-details"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
