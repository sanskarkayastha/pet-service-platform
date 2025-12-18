"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./../styles/ServicesSection.module.css";
import petHostelImg from "../image/petHostelImg.png";
import { link } from "fs";

export default function ServicesSection() {
  const router = useRouter();
  const services = [
    {
      title: "Grooming",
      subtitle: "Grooming",
      description:
        "Professional grooming services including baths, haircuts, nail trimming, and styling. Keep your pet looking and feeling their best with our expert care.",
      image:
        "https://i.pinimg.com/1200x/14/b8/12/14b8129cd1bcceae62320189794836f1.jpg",
      buttonText: "Explore Grooming Services",
      link:"services/grooming"
    },
    {
      title: "Veterinary",
      subtitle: "Veterinary Care",
      description:
        "Certified veterinarians available for check-ups, vaccinations, and urgent health concerns. Your pet's health is our top priority with comprehensive medical care.",
      image:
        "https://i.pinimg.com/1200x/7d/24/a9/7d24a92f2fd0c5032da96e33b153306c.jpg",
      buttonText: "Explore Veterinary Services",
      link:"services/vet"
    },
    {
      title: "Pet Hostel",
      subtitle: "Pet Hostel",
      description:
        "Safe and comfortable boarding with daily care, feeding, and playtime. Your furry friends stay happy in a loving environment while you're away.",
      image: 
        "https://i.pinimg.com/736x/1f/a1/68/1fa1680700d4ff66d708af0810f224b2.jpg",
      buttonText: "Explore Hostel Services",
      link:"services/hostel"
    },
  ];

  return (
    <section className={styles.servicesSection} id="services">
      <div className={styles.servicesHeader}>
        <div className={styles.servicesLabel}>What We Offer</div>
        <h2 className={styles.servicesTitle}>Services</h2>
      </div>

      <div className={styles.servicesGrid}>
        {services.map((service, index) => (
          <div
            key={index}
            className={styles.flipCard}
            onClick={(e) =>
            {
              if (!(e.target as HTMLElement).closest("button")) {
                e.currentTarget.classList.toggle(styles.flipped);
              }
            }
            }
          >
            <div className={styles.flipCardInner}>
              <div className={styles.flipCardFront}>
                <img src={service.image} alt={service.title} />
                <div className={styles.serviceName}>{service.title}</div>
              </div>

              <div className={styles.flipCardBack}>
                <h3 className={styles.serviceBackTitle}>
                  {service.subtitle}
                </h3>
                <p className={styles.serviceDescription}>
                  {service.description}
                </p>
                <button
                  className={styles.serviceBtn} onClick={() => router.push(service.link)}
                  
                >
                  {service.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
