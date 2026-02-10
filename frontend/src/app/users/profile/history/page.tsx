"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import apiClient from "@/lib/api-client";

interface Booking {
  id: number;
  businessName: string;
  serviceTitle: string;
  bookingDateTime: string;
  status: string;
  totalPrice: number;
}

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await apiClient.get("/api/bookings/my-orders");
        const data = Array.isArray(res.data) ? res.data : [];
        setBookings(data.filter((b: Booking) => b.status === "COMPLETED" || b.status === "CANCELLED"));
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Booking History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          <p style={{ marginBottom: "16px" }}>No past bookings.</p>
          <Link
            href="/users/petServices/grooming"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "linear-gradient(135deg, #9c27b0, #7b1fa2)",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Browse Services
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {bookings.map((b) => (
            <div
              key={b.id}
              style={{
                padding: "16px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: b.status === "CANCELLED" ? 0.7 : 1,
              }}
            >
              <div>
                <strong>{b.serviceTitle}</strong> at {b.businessName}
                <p style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
                  {formatDate(b.bookingDateTime)} • Rs {b.totalPrice}
                </p>
              </div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  background: b.status === "COMPLETED" ? "#e8f5e9" : "#ffebee",
                  color: b.status === "COMPLETED" ? "#2e7d32" : "#c62828",
                }}
              >
                {b.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
