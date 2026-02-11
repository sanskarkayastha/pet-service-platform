"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import "@/styles/Grooming.css";
import apiClient from "@/lib/api-client";

/* ================= TYPES ================= */

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

/* ================= PAGE ================= */

export default function GroomingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [radius, setRadius] = useState(10); // TODO: Use when distance system is added
  const [location, setLocation] = useState("Kathmandu");

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH BUSINESSES ================= */

  useEffect(() => {
    const getBusinessData = async () => {
      try {
        // Use authenticated API utility - automatically adds JWT token if available
        const json = await apiClient.get<Business[]>("/api/business/allBusinesses");
        setBusinesses(json.data);
      } catch (err) {
        console.error("Failed to fetch businesses", err);
      } finally {
        setLoading(false);
      }
    };

    getBusinessData();
  }, []);

  /* ================= FILTER ================= */

  const filteredBusinesses = businesses.filter((b) =>
    b.businessName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* ================= LOCATION DETECTION ================= */

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocation("Current Location");
        alert("Location detected! Showing services nearby.");
      },
      () => {
        alert("Unable to detect location. Please enter manually.");
      },
    );
  };

  /* ================= UI ================= */

  return (
    <div>
      {/* HERO SECTION */}
      <section className="heroine">
        <h1>Find the Best Grooming Services Near You</h1>
      </section>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="search-filter">
          <input
            className="filter-input"
            placeholder="Search for grooming services..."
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

      {/* BUSINESS GRID */}
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
              Loading businesses...
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
              No businesses found.
            </p>
          ) : (
            filteredBusinesses.map((business) => (
              <div className="service-card" key={business.id}>
                <div
                  className="card-image"
                  style={{
                    backgroundImage: `url('${business.imageUrl || "/placeholder.jpg"}')`,
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
                      className="btn-primary"
                    >
                      Book Now
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
