"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import "@/styles/Grooming.css"

interface Service {
  name: string;
  description: string;
  rating: number;
  reviews: number;
  distance: string;
  location: string;
  image: string;
}

export default function GroomingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [radius, setRadius] = useState(10);
  const [location, setLocation] = useState("Kathmandu");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Service data
  const services: Service[] = [
    {
      name: "Pawfect Groomers",
      description:
        "Professional pet grooming services with experienced staff. We provide comprehensive grooming solutions for all breeds.",
      rating: 4.8,
      reviews: 234,
      distance: "2.3 km",
      location: "Thamel, Kathmandu",
      image:
        "https://i.pinimg.com/1200x/d8/7c/57/d87c5768c8272a071b1a07046e71467d.jpg",
    },
    {
      name: "Fluffy & Clean Spa",
      description:
        "Premium grooming experience with organic products. Specialized in breed-specific cuts and styling.",
      rating: 4.9,
      reviews: 189,
      distance: "1.8 km",
      location: "Lazimpat, Kathmandu",
      image:
        "https://i.pinimg.com/1200x/bc/77/4a/bc774ad551536130e818dfea04e1ce76.jpg",
    },
    {
      name: "Pet Paradise Salon",
      description:
        "Affordable grooming services with caring professionals. Walk-ins welcome, appointments preferred.",
      rating: 4.7,
      reviews: 156,
      distance: "3.5 km",
      location: "Patan, Lalitpur",
      image:
        "https://i.pinimg.com/736x/28/ff/3a/28ff3ae2531d3bd58ceca9b6730a77b2.jpg",
    },
    {
      name: "Whiskers & Wags",
      description:
        "Expert groomers specializing in nervous and senior pets. Gentle handling and calming environment.",
      rating: 4.6,
      reviews: 142,
      distance: "4.2 km",
      location: "Bouddha, Kathmandu",
      image:
        "https://i.pinimg.com/1200x/ac/fa/b8/acfab884be3ccfbf0c2d529cc2536a02.jpg",
    },
    {
      name: "The Grooming Den",
      description:
        "Modern grooming facility with state-of-the-art equipment. Online booking available 24/7.",
      rating: 4.9,
      reviews: 278,
      distance: "1.2 km",
      location: "Jhamsikhel, Lalitpur",
      image:
        "https://i.pinimg.com/736x/e0/41/0c/e0410cfe4a874c72448eac1c145a33f4.jpg",
    },
    {
      name: "Pampered Paws Studio",
      description:
        "Boutique grooming studio offering personalized care. Exclusive products and premium services.",
      rating: 4.8,
      reviews: 201,
      distance: "2.9 km",
      location: "Baneshwor, Kathmandu",
      image:
        "https://i.pinimg.com/1200x/b2/72/13/b272139b3d2460e3fbecf0807c041bdc.jpg",
    },
  ];

  // Filter logic
  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      parseFloat(s.distance) <= radius
  );

  // Detect current location
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
      }
    );
  };

  // Modal opener
  const openModal = (service: Service) => {
    setSelectedService(service);
    setShowBooking(false);
    setSelectedTime(null);
    setSelectedDate(null);
    document.body.style.overflow = "hidden";
  };

  // Modal closer
  const closeModal = () => {
    setSelectedService(null);
    document.body.style.overflow = "auto";
  };

  // Date selection
  const handleDateSelect = (index: number) => setSelectedDate(index);

  // Time selection
  const handleTimeSelect = (time: string) => setSelectedTime(time);

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

          {/* Location */}
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

          {/* Radius */}
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

      {/* SERVICES GRID */}
      <div className="container">
        <div className="services-grid">
          {filteredServices.length === 0 ? (
            <p
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "3rem",
                color: "#888",
              }}
            >
              No services found matching your criteria.
            </p>
          ) : (
            filteredServices.map((service) => (
              <div className="service-card" key={service.name}>
                <div
                  className="card-image"
                  style={{ backgroundImage: `url('${service.image}')` }}
                ></div>

                <div className="card-content">
                  <div className="vendor-name">{service.name}</div>
                  <div className="description">{service.description}</div>

                  <div className="card-meta">
                    <div className="rating">
                      ⭐ {service.rating} ({service.reviews})
                    </div>
                    <div className="distance">📍 {service.distance}</div>
                  </div>

                  <div className="card-footer">
                    <button className="btn-book" onClick={() => openModal(service)}>
                      Book Now
                    </button>
                    <Link 
                      href="/users/petServices/grooming/detail"
                    className="btn-details" onClick={() => openModal(service)}>
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
      {selectedService && (
        <div className="modal" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>

              <h2>{selectedService.name}</h2>
              <div className="rating">
                ⭐ {selectedService.rating} ({selectedService.reviews} reviews)
              </div>
              <p>📍 {selectedService.location} | {selectedService.distance} away</p>
            </div>

            {/* MODAL BODY */}
            <div className="modal-body">
              {/* ABOUT */}
              <div className="section">
                <h3>About</h3>
                <p>
                  {selectedService.description} We provide comprehensive grooming
                  solutions for all breeds with love and care.
                </p>
              </div>

              {/* SERVICE ITEMS */}
              <div className="section">
                <h3>Services Offered</h3>
                <div className="service-list">
                  {[
                    {
                      title: "Full Groom Package",
                      details: "Bath, haircut, nail trim, ear cleaning | 90 mins",
                      price: "NPR 1,500",
                    },
                    {
                      title: "Bath & Brush",
                      details: "Shampoo, conditioner, brush out | 45 mins",
                      price: "NPR 800",
                    },
                    {
                      title: "Nail Trim & Paw Care",
                      details: "Nail clipping, paw pad treatment | 20 mins",
                      price: "NPR 400",
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

                    {/* DATE PICKER */}
                    <div className="date-picker">
                      {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                        (day, index) => (
                          <div
                            key={index}
                            className={`date-slot ${
                              selectedDate === index ? "selected" : ""
                            }`}
                            onClick={() => handleDateSelect(index)}
                          >
                            <div>{day}</div>
                            <div>{4 + index}</div>
                          </div>
                        )
                      )}
                    </div>

                    {/* TIME SLOTS */}
                    <div className="time-slots">
                      {[
                        "09:00 AM",
                        "10:30 AM",
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
                          onClick={() => handleTimeSelect(time)}
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
                      <span className="reviewer">Sarah M.</span>
                      <span className="rating">⭐⭐⭐⭐⭐</span>
                    </div>
                    <p>
                      Excellent service! My golden retriever looks amazing. The
                      staff was very gentle and professional.
                    </p>
                  </div>

                  <div className="review-item">
                    <div className="review-header">
                      <span className="reviewer">John D.</span>
                      <span className="rating">⭐⭐⭐⭐⭐</span>
                    </div>
                    <p>
                      Best grooming experience in town. They really care about
                      the pets and take their time.
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
