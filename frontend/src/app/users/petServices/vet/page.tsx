"use client";

import { useState } from "react";
import "@/styles/Grooming.css"; // reuse the same CSS

interface VetClinic {
  name: string;
  description: string;
  rating: number;
  reviews: number;
  distance: string;
  location: string;
  image: string;
}

export default function VetPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [radius, setRadius] = useState(10);
  const [location, setLocation] = useState("Kathmandu");
  const [selectedClinic, setSelectedClinic] = useState<VetClinic | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const vetClinics: VetClinic[] = [
    {
      name: "Happy Paws Veterinary Clinic",
      description:
        "Full-service veterinary clinic offering checkups, vaccinations, diagnostics, and emergency care.",
      rating: 4.9,
      reviews: 312,
      distance: "2.1 km",
      location: "Maharajgunj, Kathmandu",
      image:
        "https://i.pinimg.com/1200x/bc/77/4a/bc774ad551536130e818dfea04e1ce76.jpg",
    },
    {
      name: "City Pet Veterinary Center",
      description:
        "Experienced veterinarians providing consultations, surgery, and dental care for all pets.",
      rating: 4.7,
      reviews: 198,
      distance: "1.4 km",
      location: "Pulchowk, Lalitpur",
      image:
        "https://i.pinimg.com/1200x/d8/7c/57/d87c5768c8272a071b1a07046e71467d.jpg",
    },
    {
      name: "VetCare Animal Hospital",
      description:
        "24/7 emergency care, lab tests, vaccinations, and advanced medical facilities.",
      rating: 4.8,
      reviews: 274,
      distance: "3.0 km",
      location: "Baneshwor, Kathmandu",
      image:
        "https://i.pinimg.com/736x/28/ff/3a/28ff3ae2531d3bd58ceca9b6730a77b2.jpg",
    },
    {
      name: "Paws & Claws Vet Clinic",
      description:
        "Trusted animal clinic offering wellness exams, treatments, and minor surgeries.",
      rating: 4.6,
      reviews: 142,
      distance: "4.6 km",
      location: "Bhaktapur",
      image:
        "https://i.pinimg.com/1200x/ac/fa/b8/acfab884be3ccfbf0c2d529cc2536a02.jpg",
    },
  ];

  // Filter
  const filteredClinics = vetClinics.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      parseFloat(c.distance) <= radius
  );

  const detectLocation = () => {
    if (!navigator.geolocation)
      return alert("Geolocation not supported.");

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocation("Current Location");
        alert("Location detected! Showing services nearby.");
      },
      () => alert("Unable to detect location.")
    );
  };

  const openModal = (clinic: VetClinic) => {
    setSelectedClinic(clinic);
    setShowBooking(false);
    setSelectedDate(null);
    setSelectedTime(null);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedClinic(null);
    document.body.style.overflow = "auto";
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

          <button className="btn-primary">Search</button>
        </div>
      </div>

      {/* GRID */}
      <div className="container">
        <div className="services-grid">
          {filteredClinics.length === 0 ? (
            <p
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "3rem",
                color: "#888",
              }}
            >
              No clinics found matching your criteria.
            </p>
          ) : (
            filteredClinics.map((clinic) => (
              <div className="service-card" key={clinic.name}>
                <div
                  className="card-image"
                  style={{ backgroundImage: `url('${clinic.image}')` }}
                ></div>

                <div className="card-content">
                  <div className="vendor-name">{clinic.name}</div>
                  <div className="description">{clinic.description}</div>

                  <div className="card-meta">
                    <div className="rating">
                      ⭐ {clinic.rating} ({clinic.reviews})
                    </div>
                    <div className="distance">📍 {clinic.distance}</div>
                  </div>

                  <div className="card-footer">
                    <button className="btn-book" onClick={() => openModal(clinic)}>
                      Book Now
                    </button>
                    <button className="btn-details" onClick={() => openModal(clinic)}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedClinic && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="close-btn" onClick={closeModal}>×</button>

              <h2>{selectedClinic.name}</h2>
              <div className="rating">
                ⭐ {selectedClinic.rating} ({selectedClinic.reviews} reviews)
              </div>
              <p>📍 {selectedClinic.location} | {selectedClinic.distance} away</p>
            </div>

            <div className="modal-body">
              {/* ABOUT */}
              <div className="section">
                <h3>About</h3>
                <p>
                  {selectedClinic.description} Our veterinarians are certified and
                  experienced in providing quality care and treatment for your pet.
                </p>
              </div>

              {/* VET SERVICES */}
              <div className="section">
                <h3>Services Offered</h3>
                <div className="service-list">
                  {[
                    {
                      title: "General Health Checkup",
                      details: "Full physical exam | 20–30 mins",
                      price: "NPR 1,000",
                    },
                    {
                      title: "Vaccination Package",
                      details: "Rabies, DHPPiL, Anti-parasite | 15 mins",
                      price: "NPR 1,500",
                    },
                    {
                      title: "Diagnostics & Lab Tests",
                      details:
                        "Blood tests, X-Ray, Ultrasound (as needed) | 30–45 mins",
                      price: "NPR 2,000+",
                    },
                  ].map((s) => (
                    <div className="service-item" key={s.title}>
                      <div className="service-info">
                        <h4>{s.title}</h4>
                        <div className="service-meta">{s.details}</div>
                      </div>
                      <div className="service-price">
                        {s.price}
                        <br />
                        <button
                          className="btn-book"
                          onClick={() => setShowBooking(true)}
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOOKING SECTION (same as grooming) */}
              {showBooking && (
                <div className="section">
                  <div className="booking-section">
                    <h3>Select Date & Time</h3>

                    <div className="date-picker">
                      {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                        (day, index) => (
                          <div
                            key={index}
                            className={`date-slot ${
                              selectedDate === index ? "selected" : ""
                            }`}
                            onClick={() => setSelectedDate(index)}
                          >
                            <div>{day}</div>
                            <div>{4 + index}</div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="time-slots">
                      {[
                        "09:00 AM",
                        "10:00 AM",
                        "12:00 PM",
                        "02:00 PM",
                        "03:30 PM",
                        "05:00 PM",
                      ].map((time) => (
                        <div
                          key={time}
                          className={`time-slot ${
                            selectedTime === time ? "selected" : ""
                          }`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </div>
                      ))}
                    </div>

                    <button className="btn-primary" style={{ width: "100%" }}>
                      Confirm Appointment
                    </button>
                  </div>
                </div>
              )}

              {/* REVIEWS */}
              <div className="section">
                <h3>Customer Reviews</h3>
                <div className="reviews">
                  <div className="review-item">
                    <div className="review-header">
                      <span className="reviewer">Priya S.</span>
                      <span className="rating">⭐⭐⭐⭐⭐</span>
                    </div>
                    <p>
                      The vet was very gentle and explained everything clearly.
                      My cat received excellent care.
                    </p>
                  </div>

                  <div className="review-item">
                    <div className="review-header">
                      <span className="reviewer">Ramesh K.</span>
                      <span className="rating">⭐⭐⭐⭐⭐</span>
                    </div>
                    <p>
                      One of the best clinics in the city! Clean environment and
                      friendly staff.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
