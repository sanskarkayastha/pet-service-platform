"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import apiClient from "@/lib/api-client";
import styles from "./ReviewsSection.module.css";

type Review = {
  id: number;
  userName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

function parseCreatedAt(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return new Date(value).toISOString();
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m = 1, d = 1] = value;
    return new Date(Number(y), Number(m) - 1, Number(d)).toISOString();
  }
  return "";
}

function normalizeReview(raw: unknown): Review | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "number" ? o.id : Number(o.id);
  if (Number.isNaN(id)) return null;
  const rating = typeof o.rating === "number" ? o.rating : Number(o.rating) || 5;
  const userName = typeof o.userName === "string" ? o.userName : "Customer";
  const comment = o.comment != null ? String(o.comment) : null;
  const createdAt = parseCreatedAt(o.createdAt);
  return { id, userName, rating, comment, createdAt };
}

function normalizeReviewsList(data: unknown): Review[] {
  const arr = Array.isArray(data) ? data : (data && typeof data === "object" && "content" in (data as object) ? (data as { content: unknown }).content : null);
  if (!Array.isArray(arr)) return [];
  return arr.map(normalizeReview).filter((r): r is Review => r != null);
}

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
      if (!businessId) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiClient.get(`/api/reviews/business/${businessId}`);
        const data = res?.data != null ? res.data : res;
        setReviews(normalizeReviewsList(data));
      } catch (err) {
        console.error("Failed to load reviews", err);
        setReviews([]);
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
      const res = await apiClient.post(`/api/reviews/business/${businessId}`, {
        rating,
        comment: comment.trim() || null,
      });
      const newReview = normalizeReview(res?.data ?? res);
      if (newReview) {
        setReviews((prev) => [newReview, ...prev]);
      }
      setComment("");
      setRating(5);
      setSuccess("Thank you for your review!");
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const message = (err as { response?: { data?: string } })?.response?.data;
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
    <section className={styles.section}>
      <h2 className={styles.title}>Customer Reviews</h2>
      <p className={styles.subtitle}>
        What others say about this business
      </p>

      {loading ? (
        <p className={styles.loading}>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className={styles.empty}>
          There are no reviews for this business yet. Once customers complete a
          booking, their feedback will appear here.
        </p>
      ) : (
        <div className={styles.reviewGrid}>
          {reviews.map((r) => (
            <article key={r.id} className={styles.reviewCard}>
              <div className={styles.avatar}>
                {r.userName?.charAt(0)?.toUpperCase() || "C"}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <div className={styles.userName}>{r.userName}</div>
                  <div className={styles.date}>
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </div>
                </div>
                <div className={styles.stars}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i <= r.rating ? styles.starFilled : styles.starEmpty}
                      fill={i <= r.rating ? "currentColor" : "none"}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                {r.comment ? (
                  <p className={styles.comment}>{r.comment}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      <div className={styles.formWrap}>
        <h3 className={styles.formTitle}>Leave a review</h3>
        <p className={styles.formHint}>
          Reviews are only accepted from customers who have completed a booking
          with this business.
        </p>

        {error && <div className={styles.alertError}>{error}</div>}
        {success && <div className={styles.alertSuccess}>{success}</div>}

        <div className={styles.ratingRow}>
          <label htmlFor="review-rating">Rating</label>
          <select
            id="review-rating"
            className={styles.ratingSelect}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((v) => (
              <option key={v} value={v}>
                {v} star{v > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <textarea
          className={styles.textarea}
          rows={3}
          placeholder="Share something about your experience (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="button"
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </section>
  );
}
