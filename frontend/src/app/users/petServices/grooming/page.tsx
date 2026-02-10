"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api-fetch";
import "@/styles/Grooming.css";

/* ================= TYPES ================= */

interface Business {
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

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null,
  );
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  /* ================= FETCH BUSINESSES ================= */

  useEffect(() => {
    const getBusinessData = async () => {
      try {
        // Use authenticated API utility - automatically adds JWT token if available
        const json = await apiGet<Business[]>("/api/business/allBusinesses");
        console.log("Api is response is following:" + json);

        // assuming ResponseEntity { data: BusinessResponseDTO[] }
        setBusinesses(json);
      } catch (err) {
        console.error("Failed to fetch businesses", err);
      } finally {
        setLoading(false);
      }
    };

    getBusinessData();
  }, []);

  console.log(businesses);

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

  /* ================= MODAL ================= */

  const openModal = (business: Business) => {
    setSelectedBusiness(business);
    setShowBooking(false);
    setSelectedTime(null);
    setSelectedDate(null);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedBusiness(null);
    document.body.style.overflow = "auto";
  };

  const handleDateSelect = (index: number) => setSelectedDate(index);
  const handleTimeSelect = (time: string) => setSelectedTime(time);

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
              <div className="service-card" key={business.userId}>
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
                    {/* TODO: Add ratings later */}
                    {/* <div className="rating">⭐ 4.8 (234)</div> */}

                    {/* TODO: Add distance system later */}
                    {/* <div className="distance">📍 2.3 km</div> */}

                    <div>📍 {business.city}</div>
                  </div>

                  <div className="card-footer">
                    <button
                      className="btn-book"
                      onClick={() => openModal(business)}
                    >
                      Book Now
                    </button>
                    <Link
                      href={`/users/petServices/grooming/detail/${business.userId}`}
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

      {/* MODAL */}
      {selectedBusiness && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
              <h2>{selectedBusiness.businessName}</h2>

              {/* TODO: rating system later */}
              {/* <div className="rating">⭐ 4.8 (234 reviews)</div> */}

              <p>
                📍 {selectedBusiness.businessAddress}, {selectedBusiness.city}
              </p>
            </div>

            <div className="modal-body">
              <div className="section">
                <h3>About</h3>
                <p>{selectedBusiness.description}</p>
              </div>

              <div className="section">
                <h3>Contact</h3>
                <p>👤 Owner: {selectedBusiness.ownerName}</p>
                <p>📞 {selectedBusiness.contactNumber}</p>
                <p>📧 {selectedBusiness.email}</p>
              </div>

              {/* TODO: Services list will come from backend later */}
              {/* TODO: Booking system integration later */}
              {/* TODO: Reviews system later */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
