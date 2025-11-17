"use client";

import { useState } from "react";
import "@/styles/Grooming.css"; // Reusing same CSS file

interface Hostel {
  name: string;
  description: string;
  rating: number;
  reviews: number;
  distance: string;
  location: string;
  image: string;
}

export default function PetHostelPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [radius, setRadius] = useState(10);
  const [location, setLocation] = useState("Kathmandu");
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Using SAME IMAGES you used in Grooming Page
  const hostels: Hostel[] = [
    {
      name: "Paw Haven Pet Hostel",
      description:
        "Safe and comfortable boarding with 24/7 supervision, meal plans, and spacious play areas.",
      rating: 4.8,
      reviews: 210,
      distance: "2.3 km",
      location: "Thamel, Kathmandu",
      image:
        "https://i.pinimg.com/1200x/d8/7c/57/d87c5768c8272a071b1a07046e71467d.jpg",
    },
    {
      name: "Fluffy Stay & Play",
      description:
        "Premium pet boarding with daily walks, grooming add-ons, and climate-controlled rooms.",
      rating: 4.9,
      reviews: 188,
      distance: "1.8 km",
      location: "Lazimpat, Kathmandu",
      image:
        "https://i.pinimg.com/1200x/bc/77/4a/bc774ad551536130e818dfea04e1ce76.jpg",
    },
    {
      name: "Pet Paradise Lodge",
      description:
        "Clean and friendly hostel offering individual kennels, play sessions, and long-term stays.",
      rating: 4.7,
      reviews: 156,
      distance: "3.5 km",
      location: "Patan, Lalitpur",
      image:
        "https://i.pinimg.com/736x/28/ff/3a/28ff3ae2531d3bd58ceca9b6730a77b2.jpg",
    },
    {
      name: "Whiskers Retreat",
      description:
        "Perfect for cats and small pets. Cozy resting areas, toys, and quiet environments.",
      rating: 4.6,
      reviews: 142,
      distance: "4.2 km",
      location: "Bouddha, Kathmandu",
      image:
        "https://i.pinimg.com/1200x/ac/fa/b8/acfab884be3ccfbf0c2d529cc2536a02.jpg",
    },
    {
      name: "The Boarding Den",
      description:
        "Modern boarding facility equipped with CCTV, play yards, and hygiene-focused care.",
      rating: 4.9,
      reviews: 278,
      distance: "1.2 km",
      location: "Jhamsikhel, Lalitpur",
      image:
        "https://i.pinimg.com/736x/e0/41/0c/e0410cfe4a874c72448eac1c145a33f4.jpg",
    },
    {
      name: "Pampered Paws Stayhouse",
      description:
        "Boutique hostel providing personalized attention, premium bedding, and healthy food.",
      rating: 4.8,
      reviews: 201,
      distance: "2.9 km",
      location: "Baneshwor, Kathmandu",
      image:
        "https://i.pinimg.com/1200x/b2/72/13/b272139b3d2460e3fbecf0807c041bdc.jpg",
    },
  ];

  const filteredHostels = hostels.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      parseFloat(h.distance) <= radius
  );

  const detectLocation = () => {
    if (!navigator.geolocation)
      return alert("Geolocation not supported.");

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocation("Current Location");
        alert("Location detected! Showing nearby hostels.");
      },
      () => alert("Unable to detect location.")
    );
  };

  const openModal = (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setShowBooking(false);
    setSelectedDate(null);
    setSelectedTime(null);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedHostel(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div>
      {/* HERO */}
      <section className="hero">
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
          {filteredHostels.length === 0 ? (
            <p
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "3rem",
                color: "#888",
              }}
            >
              No hostels found matching your criteria.
            </p>
          ) : (
            filteredHostels.map((hostel) => (
              <div className="service-card" key={hostel.name}>
                <div
                  className="card-image"
                  style={{ backgroundImage: `url('${hostel.image}')` }}
                ></div>

                <div className="card-content">
                  <div className="vendor-name">{hostel.name}</div>
                  <div className="description">{hostel.description}</div>

                  <div className="card-meta">
                    <div className="rating">
                      ⭐ {hostel.rating} ({hostel.reviews})
                    </div>
                    <div className="distance">📍 {hostel.distance}</div>
                  </div>

                  <div className="card-footer">
                    <button className="btn-book" onClick={() => openModal(hostel)}>
                      Book Stay
                    </button>
                    <button
                      className="btn-details"
                      onClick={() => openModal(hostel)}
                    >
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
      {selectedHostel && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="close-btn" onClick={closeModal}>×</button>

              <h2>{selectedHostel.name}</h2>
              <div className="rating">
                ⭐ {selectedHostel.rating} ({selectedHostel.reviews} reviews)
              </div>
              <p>
                📍 {selectedHostel.location} | {selectedHostel.distance} away
              </p>
            </div>

            <div className="modal-body">
              {/* ABOUT */}
              <div className="section">
                <h3>About</h3>
                <p>
                  {selectedHostel.description} We provide a spacious, clean, and
                  friendly environment to keep your pets happy during their stay.
                </p>
              </div>

              {/* SERVICES OFFERED */}
              <div className="section">
                <h3>Boarding Packages</h3>
                <div className="service-list">
                  {[
                    {
                      title: "Standard Room",
                      details: "Comfortable bedding + daily walks | 24 hrs",
                      price: "NPR 1,200 / day",
                    },
                    {
                      title: "Deluxe Suite",
                      details:
                        "Private room, soft bedding, playtime sessions | 24 hrs",
                      price: "NPR 2,000 / day",
                    },
                    {
                      title: "Long-Term Stay",
                      details: "Discounts for stays over 7 days",
                      price: "NPR 1,000 / day",
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

              {/* BOOKING SECTION */}
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
                        "08:00 AM",
                        "10:00 AM",
                        "12:00 PM",
                        "02:00 PM",
                        "04:00 PM",
                        "06:00 PM",
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
                      Confirm Booking
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
                      <span className="reviewer">Sneha T.</span>
                      <span className="rating">⭐⭐⭐⭐⭐</span>
                    </div>
                    <p>
                      My dog loved staying here! Plenty of playtime and the staff
                      is super caring.
                    </p>
                  </div>

                  <div className="review-item">
                    <div className="review-header">
                      <span className="reviewer">Manish R.</span>
                      <span className="rating">⭐⭐⭐⭐⭐</span>
                    </div>
                    <p>
                      Clean, well-maintained, and very pet-friendly. Highly
                      recommended for boarding.
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
