"use client";

import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import apiClient from "@/lib/api-client";

interface Booking {
  id: number;
  customerName: string;
  petName: string;
  serviceTitle: string;
  bookingDateTime: string;
  status: string;
  totalPrice: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stats, setStats] = useState({
    todayBookings: 0,
    pending: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setErrorMessage(null);
      const bookingsResponse = await apiClient.get("/api/bookings/my-bookings");
      const allBookings = bookingsResponse.data;

      setBookings(allBookings.slice(0, 5));

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayBookings = allBookings.filter((b: Booking) => {
        const bookingDate = new Date(b.bookingDateTime);
        return bookingDate >= today;
      }).length;

      const pending = allBookings.filter((b: Booking) => b.status === "PENDING").length;
      const revenue = allBookings
        .filter((b: Booking) => b.status === "COMPLETED")
        .reduce((sum: number, b: Booking) => sum + b.totalPrice, 0);

      setStats({ todayBookings, pending, revenue });
    } catch (error) {
      const status = (error as any)?.response?.status;
      if (status === 403) {
        setErrorMessage(
          "You don't have permission to view this dashboard. Please sign in with a business account."
        );
        console.warn("Access denied while loading dashboard data (403).");
      } else {
        console.error("Failed to load dashboard data:", error);
        setErrorMessage("Something went wrong while loading the dashboard.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main className={styles.mainContent}>
        <p>Loading...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className={styles.mainContent}>
        <div
          style={{
            maxWidth: "480px",
            margin: "80px auto",
            padding: "24px",
            borderRadius: "12px",
            background: "#fff3e0",
            border: "1px solid #ffe0b2",
            color: "#6d4c41",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginBottom: "8px", fontSize: "22px" }}>Access restricted</h1>
          <p style={{ marginBottom: 0 }}>{errorMessage}</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainContent}>
      <div className={styles.header}>
        <div className={styles.searchBar}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h1>Dashboard</h1>
          <p>Overview of your business</p>
        </div>
        <div className={styles.actionButtons}>
          <button
            className={styles.btnOutline}
            onClick={() => router.push("/admin/services")}
          >
            <Plus size={18} />
            Manage Services
          </button>
          <button
            className={styles.btnPrimary}
            onClick={() => router.push("/admin/orders")}
          >
            View Orders
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statpurple}`}>
          <div className={styles.statLabel}>Today&apos;s Bookings</div>
          <div className={styles.statValue}>{stats.todayBookings}</div>
          <div className={styles.statChange}>Scheduled for today</div>
        </div>
        <div className={`${styles.statCard} ${styles.statorange}`}>
          <div className={styles.statLabel}>Pending</div>
          <div className={styles.statValue}>{stats.pending}</div>
          <div className={styles.statChange}>Needs approval</div>
        </div>
        <div className={`${styles.statCard} ${styles.statgreen}`}>
          <div className={styles.statLabel}>Total Revenue</div>
          <div className={styles.statValue}>Rs {stats.revenue.toLocaleString()}</div>
          <div className={styles.statChange}>From completed bookings</div>
        </div>
      </div>

      <div className={styles.bookingsSection}>
        <div className={styles.sectionHeader}>
          <h2>Recent Bookings</h2>
          <button
            className={styles.btnOutline}
            onClick={() => router.push("/admin/orders")}
            style={{ fontSize: "14px", padding: "6px 12px" }}
          >
            View All
          </button>
        </div>
        <p className={styles.totalCount}>{bookings.length} recent bookings</p>

        {bookings.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>
            No bookings yet.
          </p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className={styles.bookingCard}>
              <div className={styles.bookingHeader}>
                <div className={styles.bookingId}>
                  <span>#{booking.id}</span>
                  <span className={styles.statusBadge}>{booking.status}</span>
                </div>
                <div className={styles.bookingPrice}>Rs {booking.totalPrice}</div>
              </div>
              <div className={styles.bookingDetails}>
                <div className={styles.detailItem}>
                  <h4>CUSTOMER</h4>
                  <p>{booking.customerName}</p>
                </div>
                {booking.petName && (
                  <div className={styles.detailItem}>
                    <h4>PET</h4>
                    <p>{booking.petName}</p>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <h4>SERVICE</h4>
                  <p>{booking.serviceTitle}</p>
                </div>
                <div className={styles.detailItem}>
                  <h4>DATE & TIME</h4>
                  <p>{formatDateTime(booking.bookingDateTime)}</p>
                </div>
              </div>
              <div className={styles.bookingActions}>
                <button
                  className={`${styles.btnAction} ${styles.btnView}`}
                  onClick={() => router.push("/admin/orders")}
                >
                  👁 View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
