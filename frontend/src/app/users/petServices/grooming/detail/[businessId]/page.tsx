import React from "react";
import { Star } from "lucide-react";
import Link from "next/link";
import styles from "../page.module.css";
import Services from "../components/Services";
import img1 from "../../../../../../image/dog-salon.jpg";
import BusinessMap from "../components/BusinessMap";
import ReviewsSection from "../components/ReviewsSection";

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
    rating?: number;
    totalReviews?: number;
    latitude?: number;
    longitude?: number;
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

  const rating = business?.rating;
  const reviewsCount = business?.totalReviews;
  const latitude = business?.latitude;
  const longitude = business?.longitude;

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <h1>{name}</h1>
        <div className={styles.rating}>
          {typeof rating === "number" && typeof reviewsCount === "number" ? (
            <span>
              <Star size={16} fill="#facc15" strokeWidth={0} />{" "}
              {rating.toFixed(1)} ({reviewsCount})
            </span>
          ) : (
            <span>New business</span>
          )}
          {" • "}
          <span>{address}</span>
          <a href="#" className={styles.link}>Get directions</a>
        </div>
        <div className={styles.imageGrid}>
          <div className={styles.mainImage}>
            <img src={mainImage} alt="Pet Grooming Room" />
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

      <ReviewsSection businessId={businessId} />

      <hr className={styles.divider} />

      <section className={styles.about}>
        <h2>About Us</h2>
        <p>{description}</p>
      </section>

      <hr className={styles.divider} />

      <section className={styles.location}>
        <h2>Location</h2>
        {typeof latitude === "number" && typeof longitude === "number" ? (
          <BusinessMap
            name={name}
            address={address}
            latitude={latitude}
            longitude={longitude}
          />
        ) : (
          <div className={styles.mapBox}>
            <p>{address}</p>
            <p className={styles.mapNote}>
              Map will appear here once a location is set for this business.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
