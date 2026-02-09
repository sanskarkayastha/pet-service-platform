"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { Search, Plus } from "lucide-react";

import styles from "./page.module.css";
import AddServiceModal from "./components/AddServiceModal";
import { CompanyType } from "./config";
import { DASHBOARD_CONFIG } from "./dashboardConfig";

export default function AdminDashboard() {
  const params = useParams();
  const companyType = params.companyType as CompanyType | undefined;

  const dashboard = companyType ? DASHBOARD_CONFIG[companyType] : undefined;

  // 🔍 Debug
  useEffect(() => {
    console.log("companyType:", companyType);
    console.log("dashboard config:", dashboard);
  }, [companyType, dashboard]);

  if (!companyType || !dashboard) {
    notFound();
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <main className={styles.mainContent}>
      {/* Search */}
      <div className={styles.header}>
        <div className={styles.searchBar}>
          <Search size={18} />
          <input
            type="text"
            placeholder={`Search ${dashboard.title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h1>{dashboard.title}</h1>
          <p>{dashboard.description}</p>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.btnOutline} onClick={() => setOpen(true)}>
            <Plus size={18} />
            Add Service
          </button>
          <button className={styles.btnPrimary}>
            <Plus size={18} />
            New Booking
          </button>
        </div>
      </div>

      <AddServiceModal
        isOpen={open}
        onClose={() => setOpen(false)}
        companyType={companyType}
      />

      {/* Stats */}
      <div className={styles.statsGrid}>
        {dashboard.stats.map((stat, index) => (
          <div
            key={index}
            className={`${styles.statCard} ${styles[`stat${stat.type}`]}`}
          >
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statChange}>{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Bookings */}
      <div className={styles.bookingsSection}>
        <div className={styles.sectionHeader}>
          <h2>All Bookings</h2>
        </div>

        <p className={styles.totalCount}>
          {dashboard.bookings.length} total bookings
        </p>

        {dashboard.bookings.map((booking) => (
          <div key={booking.id} className={styles.bookingCard}>
            <div className={styles.bookingHeader}>
              <div className={styles.bookingId}>
                <span>{booking.id}</span>
                <span className={styles.statusBadge}>{booking.status}</span>
              </div>
              <div className={styles.bookingPrice}>{booking.price}</div>
            </div>

            <div className={styles.bookingDetails}>
              <div className={styles.detailItem}>
                <h4>CUSTOMER</h4>
                <p>{booking.customer}</p>
              </div>

              {booking.pet && (
                <div className={styles.detailItem}>
                  <h4>PET</h4>
                  <p>{booking.pet}</p>
                </div>
              )}

              <div className={styles.detailItem}>
                <h4>SERVICE</h4>
                <p>{booking.service}</p>
              </div>

              <div className={styles.detailItem}>
                <h4>DATE & TIME</h4>
                <p>{booking.dateTime}</p>
              </div>
            </div>

            <div className={styles.bookingActions}>
              <button className={`${styles.btnAction} ${styles.btnApprove}`}>
                ✓ Approve
              </button>
              <button className={`${styles.btnAction} ${styles.btnView}`}>
                👁 View Details
              </button>
              <button className={`${styles.btnAction} ${styles.btnCancel}`}>
                ✕ Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
