"use client";

import React from "react";
import "./../styles/ServicesSection.css"; // same CSS you already have

export default function ServicesSection() {
  // You can easily extend this array later
  const services = [
    {
      title: "Grooming",
      subtitle: "Grooming",
      description:
        "Professional grooming services including baths, haircuts, nail trimming, and styling. Keep your pet looking and feeling their best with our expert care.",
      image:
        "https://i.pinimg.com/736x/8c/04/7e/8c047e8e532d73cddb858870fca03860.jpg",
      buttonText: "Explore Grooming Services",
    },
    {
      title: "Veterinary",
      subtitle: "Veterinary Care",
      description:
        "Certified veterinarians available for check-ups, vaccinations, and urgent health concerns. Your pet's health is our top priority with comprehensive medical care.",
      image:
        "https://i.pinimg.com/1200x/76/28/76/762876441c9ac51b1bef0800de39433b.jpg",
      buttonText: "Explore Veterinary Services",
    },
    {
      title: "Pet Hostel",
      subtitle: "Pet Hostel",
      description:
        "Safe and comfortable boarding with daily care, feeding, and playtime. Your furry friends stay happy in a loving environment while you're away.",
      image:
        "https://i.pinimg.com/736x/6b/e2/4c/6be24c63a21773b534f55009f9a6973b.jpg",
      buttonText: "Explore Hostel Services",
    },
  ];

  return (
    <section className="services-section" id="services">
      <div className="services-header">
        <div className="services-label">What We Offer</div>
        <h2 className="services-title">Services</h2>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <div
            className="flip-card"
            key={index}
            onClick={(e) => e.currentTarget.classList.toggle("flipped")}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src={service.image} alt={service.title} />
                <div className="service-name">{service.title}</div>
              </div>
              <div className="flip-card-back">
                <h3 className="service-back-title">{service.subtitle}</h3>
                <p className="service-description">{service.description}</p>
                <button className="service-btn">{service.buttonText}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
