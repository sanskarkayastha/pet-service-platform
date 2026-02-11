"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import styles from "../page.module.css";

type Review = {
  id: number;
  userName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export default function ReviewsSection({ businessId }: { businessId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get<Review[]>(
          `/api/reviews/business/${businessId}`,
        );
        setReviews(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [businessId]);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    if (!rating) {
      setError("Please select a rating.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiClient.post<Review>(
        `/api/reviews/business/${businessId}`,
        {
          rating,
          comment: comment.trim() || null,
        },
      );
      setReviews((prev) => [res.data, ...prev]);
      setComment("");
      setRating(5);
      setSuccess("Thank you for your review!");
    } catch (err: any) {
      const status = err?.response?.status;
      const message: string | undefined = err?.response?.data;
      if (status === 403) {
        setError(
          "You can only review this business after you have completed a booking.",
        );
      } else if (typeof message === "string" && message.length < 160) {
        setError(message);
      } else {
        setError("We couldn't submit your review. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.reviews}>
      <h2>Customer Reviews</h2>

      {loading ? (
        <p style={{ marginTop: 16, color: "#666" }}>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p style={{ marginTop: 16, color: "#666" }}>
          There are no reviews for this business yet. Once customers start
          booking, their feedback will appear here.
        </p>
      ) : (
        <div className={styles.reviewGrid}>
          {reviews.map((r) => (
            <div key={r.id} className={styles.reviewCard}>
              <div className={styles.avatar}>
                {r.userName?.charAt(0)?.toUpperCase() || "C"}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{r.userName}</div>
                <div className={styles.time}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
                <div style={{ marginBottom: 4 }}>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>
                {r.comment && <p>{r.comment}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 32, maxWidth: 480 }}>
        <h3 style={{ marginBottom: 8 }}>Leave a review</h3>
        <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: 12 }}>
          Reviews are only accepted from customers who have completed a booking
          with this business.
        </p>

        {error && (
          <div
            style={{
              marginBottom: 8,
              padding: "8px 10px",
              borderRadius: 8,
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: "0.85rem",
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              marginBottom: 8,
              padding: "8px 10px",
              borderRadius: 8,
              background: "#ecfdf5",
              color: "#15803d",
              fontSize: "0.85rem",
            }}
          >
            {success}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <label style={{ fontSize: "0.9rem" }}>
            Rating:{" "}
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((v) => (
                <option key={v} value={v}>
                  {v} star{v > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </label>
        </div>
        <textarea
          rows={3}
          placeholder="Share something about your experience (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: "0.9rem",
            marginBottom: 8,
          }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            padding: "8px 16px",
            borderRadius: 999,
            border: "none",
            background:
              "linear-gradient(135deg, #9c27b0, #7b1fa2)",
            color: "#fff",
            fontSize: "0.9rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </section>
  );
}

