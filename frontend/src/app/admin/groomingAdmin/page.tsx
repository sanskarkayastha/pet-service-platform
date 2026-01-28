'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import styles from './page.module.css';
import AddServiceModal from './components/AddServiceModal';

interface StatCard {
  label: string;
  value: string;
  change: string;
  type: 'purple' | 'orange' | 'green';
}

interface BookingDetail {
  label: string;
  value: string;
}

interface Booking {
  id: string;
  status: string;
  price: string;
  customer: string;
  pet: string;
  service: string;
  dateTime: string;
}

// Dummy API Data
const statsData: StatCard[] = [
  {
    label: "Today's Booking",
    value: '8',
    change: '+7 from Yesterday',
    type: 'purple',
  },
  {
    label: 'Pending',
    value: '5',
    change: 'Needs approval',
    type: 'orange',
  },
  {
    label: 'Revenue Today',
    value: '₹12,500',
    change: '+From 8 bookings',
    type: 'green',
  },
];

const bookingsData: Booking[] = [
  {
    id: 'GRO01',
    status: 'confirmed',
    price: 'Rs 15000',
    customer: 'John Doe',
    pet: 'Max (Golden Retriever)',
    service: 'Full Grooming',
    dateTime: '2025-10-30, 10:00AM',
  },
];

export default function GainingService() {
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);


  return (
    <main className={styles.mainContent}>
      {/* Header with Search */}
      <div className={styles.header}>
        <div className={styles.searchBar}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search services, bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Page Title and Actions */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h1>Grooming Service</h1>
          <p>Manage grooming appointments and services</p>
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

      <AddServiceModal isOpen={open} onClose={() => setOpen(false)} />


      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {statsData.map((stat, index) => (
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

      {/* Bookings Section */}
      <div className={styles.bookingsSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <h2>All Bookings</h2>
            <span className={styles.badge}>pending</span>
          </div>
        </div>
        <p className={styles.totalCount}>{bookingsData.length} total bookings</p>

        {/* Booking Cards */}
        {bookingsData.map((booking) => (
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
              <div className={styles.detailItem}>
                <h4>PET</h4>
                <p>{booking.pet}</p>
              </div>
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