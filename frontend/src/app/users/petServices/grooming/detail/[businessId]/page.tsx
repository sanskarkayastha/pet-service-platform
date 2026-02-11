import React from "react";
import { Star, MapPin } from "lucide-react";
import styles from "../page.module.css";
import Services from "../components/Services";
import img1 from "../../../../../../image/dog-salon.jpg";
import img2 from "../../../../../../image/dog-salon2.jpg";
import img3 from "../../../../../../image/hero-salon.jpg";
import { MessageBusinessButton } from "@/components/messages/MessageBusinessButton";
import { BookServiceButton } from "@/components/BookServiceButton";

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const businessNumericId = Number(businessId);

  let business: {
    businessName: string;
    description?: string;
    businessAddress?: string;
    city?: string;
    imageUrl?: string;
    rating?: number;
    totalReviews?: number;
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
          <div className={styles.sideImages}>
            <img src={img2.src} alt="Grooming" />
            <img src={img3.src} alt="Boarding" />
          </div>
        </div>
      </section>

      <section className={styles.services}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <h2>Our Services</h2>
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {Number.isFinite(businessNumericId) && (
              <MessageBusinessButton
                businessId={businessNumericId}
                businessName={name}
              />
            )}
            <BookServiceButton
              href={`/users/petServices/grooming/detail/${businessId}/booking`}
            />
          </div>
        </div>
        <Services businessId={businessId} />
      </section>

      <hr className={styles.divider} />

      <section className={styles.reviews}>
        <h2>Customer Reviews</h2>
        <p style={{ marginTop: "16px", color: "#666" }}>
          There are no reviews for this business yet. Once customers start
          booking, their feedback will appear here.
        </p>
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
