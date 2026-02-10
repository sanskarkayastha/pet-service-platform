import React from "react";
import { Star, MapPin } from "lucide-react";
import Link from "next/link";
import styles from "../page.module.css";
import Services from "../components/Services";
import img1 from "../../../../../../image/dog-salon.jpg";
import img2 from "../../../../../../image/dog-salon2.jpg";
import img3 from "../../../../../../image/hero-salon.jpg";

const REVIEWS = [
  { id: 1, name: "Sarah Johnson", initial: "S", time: "2 weeks ago", comment: "Amazing service! The staff was so gentle with my nervous dog. Grooming was perfect." },
  { id: 2, name: "Michael Chen", initial: "M", time: "1 month ago", comment: "Best pet care facility in town. Professional, clean, and they really care about the animals." },
  { id: 3, name: "Emma Wilson", initial: "E", time: "3 weeks ago", comment: "Great experience overall. The grooming was excellent, though I had to wait a bit longer." },
];

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;

  let business: {
    businessName: string;
    description?: string;
    businessAddress?: string;
    city?: string;
    imageUrl?: string;
  } | null = null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await fetch(`${baseUrl}/api/business/${businessId}`, {
      cache: "no-store",
    });
    if (res.ok) {
      business = await res.json();
    }
  } catch {
    // Fallback to static data
  }

  const name = business?.businessName || "Pet Care";
  const address = business?.businessAddress && business?.city
    ? `${business.businessAddress}, ${business.city}`
    : business?.city || "Location";
  const description = business?.description || "Trusted pet care services.";
  const mainImage = business?.imageUrl || img1.src;

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <h1>{name}</h1>
        <div className={styles.rating}>
          <span><Star size={16} fill="#facc15" strokeWidth={0} /> 5.0 (127)</span>
          • <span>Open until 20:00</span> • <span>{address}</span>
          <a href="#" className={styles.link}>Get directions</a>
        </div>
        <div className={styles.imageGrid}>
          <div className={styles.mainImage}>
            <img src={mainImage} alt="Pet Grooming Room" />
          </div>
          <div className={styles.sideImages}>
            <img src={img2.src} alt="Grooming" />
            <img src={img3.src} alt="Boarding" />
          </div>
        </div>
      </section>

      <section className={styles.services}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Our Services</h2>
          <Link
            href={`/users/petServices/grooming/detail/${businessId}/booking`}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #9c27b0, #7b1fa2)",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "500",
            }}
          >
            Book a Service
          </Link>
        </div>
        <Services businessId={businessId} />
      </section>

      <hr className={styles.divider} />

      <section className={styles.reviews}>
        <h2>Customer Reviews</h2>
        <div className={styles.reviewGrid}>
          {REVIEWS.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.avatar}>{review.initial}</div>
              <div>
                <h4>{review.name}</h4>
                <p className={styles.time}>{review.time}</p>
                <p>{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={styles.about}>
        <h2>About Us</h2>
        <p>{description}</p>
      </section>

      <hr className={styles.divider} />

      <section className={styles.location}>
        <h2>Location</h2>
        <div className={styles.mapBox}>
          <MapPin size={28} />
          <p>{address}</p>
          <p className={styles.mapNote}>Map integration available</p>
        </div>
      </section>
    </div>
  );
}
