"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import styles from "../page.module.css";
import apiClient from "@/lib/api-client";

interface Booking {
  id: number;
  businessId: number;
  businessName: string;
  serviceId: number;
  serviceTitle: string;
  userId: string;
  customerName: string;
  bookingDateTime: string;
  endDateTime: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  customerEmail: string;
  customerPhone: string;
  petName: string;
  petBreed: string;
  notes: string;
  totalPrice: number;
  addons: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
  }>;
  createdAt: string;
}

export default function OrdersPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    try {
      let response;
      if (filter === "all") {
        response = await apiClient.get("/api/bookings/my-bookings");
      } else {
        response = await apiClient.get(`/api/bookings/my-bookings/status/${filter}`);
      }
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
      await apiClient.put(`/api/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      loadBookings();
    } catch (error) {
      console.error("Failed to update booking status:", error);
      alert("Failed to update booking status");
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; color: string; icon: typeof Clock }> = {
      PENDING: { bg: "#fff3e0", color: "#ff9800", icon: Clock },
      CONFIRMED: { bg: "#e8f5e9", color: "#4caf50", icon: CheckCircle },
      COMPLETED: { bg: "#e3f2fd", color: "#2196f3", icon: CheckCircle },
      CANCELLED: { bg: "#ffebee", color: "#f44336", icon: XCircle },
    };
    return statusConfig[status] || statusConfig.PENDING;
  };

  if (loading) {
    return (
      <main className={styles.mainContent}>
        <p>Loading...</p>
      </main>
    );
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    revenue: bookings
      .filter((b) => b.status === "COMPLETED")
      .reduce((sum, b) => sum + b.totalPrice, 0),
  };

  return (
    <main className={styles.mainContent}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h1>Orders & Bookings</h1>
          <p>Manage customer bookings and orders</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statpurple}`}>
          <div className={styles.statLabel}>Total Bookings</div>
          <div className={styles.statValue}>{stats.total}</div>
        </div>
        <div className={`${styles.statCard} ${styles.statorange}`}>
          <div className={styles.statLabel}>Pending</div>
          <div className={styles.statValue}>{stats.pending}</div>
        </div>
        <div className={`${styles.statCard} ${styles.statgreen}`}>
          <div className={styles.statLabel}>Revenue</div>
          <div className={styles.statValue}>Rs {stats.revenue.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {["all", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: "8px 16px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              background: filter === status ? "#9c27b0" : "white",
              color: filter === status ? "white" : "#666",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {status === "all" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className={styles.bookingsSection}>
        <div className={styles.sectionHeader}>
          <h2>All Bookings</h2>
        </div>
        <p className={styles.totalCount}>{bookings.length} bookings</p>

        {bookings.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>
            No bookings found.
          </p>
        ) : (
          bookings.map((booking) => {
            const statusConfig = getStatusBadge(booking.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={booking.id} className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                  <div className={styles.bookingId}>
                    <span>#{booking.id}</span>
                    <span
                      className={styles.statusBadge}
                      style={{
                        backgroundColor: statusConfig.bg,
                        color: statusConfig.color,
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <StatusIcon size={14} />
                      {booking.status}
                    </span>
                  </div>
                  <div className={styles.bookingPrice}>Rs {booking.totalPrice}</div>
                </div>

                <div className={styles.bookingDetails}>
                  <div className={styles.detailItem}>
                    <h4>CUSTOMER</h4>
                    <p>{booking.customerName}</p>
                    {booking.customerEmail && (
                      <p style={{ fontSize: "12px", color: "#999" }}>{booking.customerEmail}</p>
                    )}
                    {booking.customerPhone && (
                      <p style={{ fontSize: "12px", color: "#999" }}>{booking.customerPhone}</p>
                    )}
                  </div>

                  {booking.petName && (
                    <div className={styles.detailItem}>
                      <h4>PET</h4>
                      <p>{booking.petName}</p>
                      {booking.petBreed && (
                        <p style={{ fontSize: "12px", color: "#999" }}>{booking.petBreed}</p>
                      )}
                    </div>
                  )}

                  <div className={styles.detailItem}>
                    <h4>SERVICE</h4>
                    <p>{booking.serviceTitle}</p>
                  </div>

                  <div className={styles.detailItem}>
                    <h4>DATE & TIME</h4>
                    <p>{formatDateTime(booking.bookingDateTime)}</p>
                    {booking.endDateTime && (
                      <p style={{ fontSize: "12px", color: "#999" }}>
                        Ends: {formatDateTime(booking.endDateTime)}
                      </p>
                    )}
                  </div>
                </div>

                {booking.notes && (
                  <div
                    style={{
                      marginTop: "15px",
                      padding: "10px",
                      background: "#f5f5f5",
                      borderRadius: "6px",
                    }}
                  >
                    <strong>Notes:</strong> {booking.notes}
                  </div>
                )}

                {booking.addons && booking.addons.length > 0 && (
                  <div style={{ marginTop: "15px" }}>
                    <strong style={{ fontSize: "12px", color: "#999" }}>ADD-ONS:</strong>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "5px",
                        flexWrap: "wrap",
                      }}
                    >
                      {booking.addons.map((addon) => (
                        <span
                          key={addon.id}
                          style={{
                            padding: "4px 8px",
                            background: "#e3f2fd",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          {addon.name} (+Rs {addon.price})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.bookingActions}>
                  {booking.status === "PENDING" && (
                    <>
                      <button
                        className={`${styles.btnAction} ${styles.btnApprove}`}
                        onClick={() => handleStatusUpdate(booking.id, "CONFIRMED")}
                      >
                        ✓ Confirm
                      </button>
                      <button
                        className={`${styles.btnAction} ${styles.btnCancel}`}
                        onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                      >
                        ✕ Cancel
                      </button>
                    </>
                  )}
                  {booking.status === "CONFIRMED" && (
                    <button
                      className={`${styles.btnAction} ${styles.btnApprove}`}
                      onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                    >
                      ✓ Mark Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
