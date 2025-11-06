"use client";

import React, { useEffect } from "react";

import "@/styles/Grooming.css"
import {
  generateCards,
  updateRadius,
  detectLocation,
  searchServices,
  openModal,
  closeModal,
  showBooking,
  selectDate,
  selectTime,
  initPage,
} from "@/script/groomingLogic";

const GroomingPage: React.FC = () => {
  useEffect(() => {
    initPage(); // Initialize logic and event listeners
  }, []);

  return (
    <>

      {/* Hero Section */}
      <section className="hero">
        <h1>Find the Best Grooming Services Near You</h1>
      </section>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-filter">
          <input
            type="text"
            id="searchInputMain"
            className="filter-input"
            placeholder="Search for grooming services by name..."
          />
          <div className="location-row">
            <input
              type="text"
              id="locationInput"
              className="filter-input"
              placeholder="Enter your location"
              defaultValue="Kathmandu"
            />
            <button
              className="detect-location-btn"
              onClick={detectLocation}
            >
              📍 Detect
            </button>
          </div>
          <div className="radius-control">
            <span>Radius:</span>
            <input
              type="range"
              id="radiusSlider"
              className="radius-slider"
              min={1}
              max={50}
              defaultValue={10}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateRadius(e.target.value)
              }
            />
            <span className="radius-value" id="radiusValue">
              10 km
            </span>
          </div>
          <button className="btn-primary" onClick={searchServices}>
            Search
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="services-grid" id="servicesGrid"></div>
      </div>

      {/* Modal */}
      <div className="modal" id="serviceModal">
        <div className="modal-content">
          <div className="modal-header">
            <button className="close-btn" onClick={closeModal}>
              ×
            </button>
            <h2 id="modalVendorName">Pawfect Groomers</h2>
            <div className="rating">
              <span>⭐ 4.8</span>
              <span style={{ opacity: 0.8 }}>(234 reviews)</span>
            </div>
            <p style={{ marginTop: "0.5rem" }}>
              📍 Thamel, Kathmandu | 2.3 km away
            </p>
          </div>

          <div className="modal-body">
            {/* About Section */}
            <div className="section">
              <h3>About</h3>
              <p>
                Professional pet grooming services with experienced staff. We
                provide comprehensive grooming solutions for all breeds with
                love and care.
              </p>
            </div>

            {/* Services Offered */}
            <div className="section">
              <h3>Services Offered</h3>
              <div className="service-list">
                <div className="service-item">
                  <div className="service-info">
                    <h4>Full Groom Package</h4>
                    <div className="service-meta">
                      Bath, haircut, nail trim, ear cleaning | 90 mins
                    </div>
                  </div>
                  <div className="service-price">
                    NPR 1,500
                    <br />
                    <button className="btn-book" onClick={showBooking}>
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Section */}
            <div
              className="section"
              id="bookingSection"
              style={{ display: "none" }}
            >
              <div className="booking-section">
                <h3>Select Date & Time</h3>
                <div className="date-picker">
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                    (day, i) => (
                      <div
                        key={i}
                        className="date-slot"
                        onClick={(e) =>
                          selectDate(
                            (e.currentTarget as HTMLElement).closest(".date-slot")
                          )
                        }
                      >
                        <div>{day}</div>
                        <div>{4 + i}</div>
                      </div>
                    )
                  )}
                </div>
                <div className="time-slots">
                  {[
                    "09:00 AM",
                    "10:30 AM",
                    "12:00 PM",
                    "02:00 PM",
                    "03:30 PM",
                    "05:00 PM",
                  ].map((time, i) => (
                    <div
                      key={i}
                      className="time-slot"
                      onClick={(e) => selectTime(e.currentTarget)}
                    >
                      {time}
                    </div>
                  ))}
                </div>
                <button className="btn-primary" style={{ width: "100%" }}>
                  Confirm Booking
                </button>
              </div>
            </div>

            {/* Reviews */}
            <div className="section">
              <h3>Customer Reviews</h3>
              <div className="reviews">
                <div className="review-item">
                  <div className="review-header">
                    <span className="reviewer">Sarah M.</span>
                    <span className="rating">⭐⭐⭐⭐⭐</span>
                  </div>
                  <p>
                    Excellent service! My golden retriever looks amazing. The
                    staff was very gentle and professional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroomingPage;
