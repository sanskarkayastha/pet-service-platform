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
  latitude?: number | null;
  longitude?: number | null;
}

type Coordinates = {
  lat: number;
  lng: number;
};

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceKm(from: Coordinates, to: Coordinates): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export default function VetPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [radius, setRadius] = useState(10); // reserved for future distance filtering
  const [location, setLocation] = useState("Kathmandu");
  const [center, setCenter] = useState<Coordinates | null>(null);
  const [distanceFilterEnabled, setDistanceFilterEnabled] = useState(false);

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBusinessData = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
        const response = await fetch(`${apiBase}/api/business/allBusinesses`);
        if (!response.ok) {
          throw new Error(`Failed to fetch veterinary businesses: ${response.status}`);
        }
        const json: Business[] = await response.json();
        setBusinesses(
          json.filter((b) => (b.category || []).includes("VETERINARY")),
        );
      } catch (err) {
        console.error("Failed to fetch veterinary businesses", err);
      } finally {
        setLoading(false);
      }
    };

    getBusinessData();
  }, []);

  const filteredBusinesses = businesses.filter((b) =>
    b.businessName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const visibleBusinesses = filteredBusinesses.filter((business) => {
    if (!distanceFilterEnabled || !center) {
      return true;
    }

    if (business.latitude == null || business.longitude == null) {
      return false;
    }

    const dist = distanceKm(center, {
      lat: business.latitude,
      lng: business.longitude,
    });
    return dist <= radius;
  });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(nextCenter);
        setDistanceFilterEnabled(true);
        setLocation("Current Location");
        alert("Location detected! Showing services nearby.");
      },
      () => {
        alert("Unable to detect location. Please enter manually.");
      },
    );
  };

  const handleDistanceSearch = async () => {
    if (!location.trim()) {
      setDistanceFilterEnabled(false);
      setCenter(null);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`,
      );
      const results: Array<{ lat: string; lon: string }> = await response.json();

      if (!results.length) {
        alert("Location not found. Try a more specific place.");
        return;
      }

      setCenter({
        lat: Number(results[0].lat),
        lng: Number(results[0].lon),
      });
      setDistanceFilterEnabled(true);
    } catch (error) {
      console.error("Failed to resolve location", error);
      alert("Unable to search by location right now.");
    }
  };

  return (
    <div>
      {/* HERO */}
      <section className="heroine">
        <h1>Find Trusted Veterinary Clinics Near You</h1>
      </section>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="search-filter">
          <input
            className="filter-input"
            placeholder="Search for veterinary clinics..."
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

          <button className="btn-primary" onClick={handleDistanceSearch}>
            Search
          </button>
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
              Loading clinics...
            </p>
          ) : visibleBusinesses.length === 0 ? (
            <p
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "3rem",
                color: "#888",
              }}
            >
              No veterinary businesses found.
            </p>
          ) : (
            visibleBusinesses.map((business) => (
              <div className="service-card" key={business.id}>
                <div
                  className="card-image"
                  style={{
                    backgroundImage: business.imageUrl
                      ? `url('${business.imageUrl}')`
                      : "linear-gradient(135deg, #22c55e, #0ea5e9)",
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
