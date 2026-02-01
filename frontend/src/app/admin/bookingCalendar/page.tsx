"use client";

import { useState } from "react";
import Sidebar from "../groomingAdmin/components/Sidebar";
import styles from "./page.module.css";

export default function BookingCalendarPage() {
  const [showWorkingHours, setShowWorkingHours] = useState(false);
  const [showAddNew, setShowAddNew] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0)); // Jan 2026
  const [activeDay, setActiveDay] = useState<number | null>(28);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const changeMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
    setActiveDay(null);
  };

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        {/* TOP BAR */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>Booking Calendar</h1>
            <p className={styles.subtitle}>
              Manage appointments, breaks, and holidays
            </p>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.secondaryBtn}
              onClick={() => setShowWorkingHours(true)}
            >
              ⚙ Working Hours
            </button>
            <button
              className={styles.primaryBtn}
              onClick={() => setShowAddNew(true)}
            >
              + Add New
            </button>
          </div>
        </div>

        {/* DASHBOARD STATS */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.orange}`}>
            <h2>12</h2>
            <p>Today's Appointments</p>
          </div>

          <div className={`${styles.statCard} ${styles.yellow}`}>
            <h2>1</h2>
            <p>Scheduled Breaks</p>
          </div>

          <div className={`${styles.statCard} ${styles.red}`}>
            <h2>0</h2>
            <p>Upcoming Holidays</p>
          </div>

          <div className={`${styles.statCard} ${styles.purple}`}>
            <h2>6</h2>
            <p>Working Days</p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className={styles.dashboardGrid}>
          {/* LEFT CALENDAR */}
          <div className={styles.card}>
            <h3 className={styles.title}>Select Date</h3>

            <div className={styles.calendar}>
              {/* MONTH HEADER */}
              <div className={styles.monthHeader}>
                <button
                  className={styles.navBtn}
                  onClick={() => changeMonth(-1)}
                >
                  ‹
                </button>

                <p className={styles.month}>
                  {currentDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <button
                  className={styles.navBtn}
                  onClick={() => changeMonth(1)}
                >
                  ›
                </button>
              </div>

              {/* WEEK DAYS */}
              <div className={styles.weekDays}>
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>

              {/* DAYS GRID */}
              <div className={styles.calendarGrid}>
                {/* Empty cells before month start */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Month days */}
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveDay(i + 1)}
                    className={`${styles.day} ${
                      activeDay === i + 1 ? styles.activeDay : ""
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* DAY INFO */}
            <div className={styles.dayInfo}>
              <span className={styles.dayName}>
                {activeDay
                  ? new Date(year, month, activeDay).toLocaleDateString(
                      "default",
                      {
                        weekday: "long",
                      },
                    )
                  : "Select a day"}
              </span>

              <span className={styles.openBadge}>Open</span>
            </div>

            <small className={styles.time}>09:00 AM - 06:00 PM</small>
          </div>

          {/* RIGHT SIDE */}
          <div className={styles.rightColumn}>
            {/* BREAKS */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Breaks & Holidays</h3>
                <div className={styles.inlineBtns}>
                  <button>☕ Break</button>
                  <button>🏖 Holiday</button>
                </div>
              </div>

              <div className={styles.breakItem}>
                <strong>Lunch Break</strong>
                <p>12:00 PM - 01:00 PM</p>
              </div>
            </div>

            {/* APPOINTMENTS */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Wednesday, January 28, 2026</h3>
                <span className={styles.countBadge}>4 appointments</span>
              </div>

              {[
                { time: "09:00 AM", name: "Max", status: "confirmed" },
                { time: "11:00 AM", name: "Bella", status: "pending" },
                { time: "02:00 PM", name: "Charlie", status: "confirmed" },
                { time: "04:00 PM", name: "Luna", status: "confirmed" },
              ].map((a, i) => (
                <div key={i} className={styles.appointment}>
                  <span className={styles.time}>{a.time}</span>
                  <strong>{a.name}</strong>
                  <span className={`${styles.status} ${styles[a.status]}`}>
                    {a.status}
                  </span>
                  <button className={styles.viewBtn}>View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* WORKING HOURS MODAL */}
      {showWorkingHours && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Working Hours</h3>
              <button onClick={() => setShowWorkingHours(false)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <p>Set your business operating hours here.</p>
              {/* time pickers later */}
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setShowWorkingHours(false)}>Cancel</button>
              <button className={styles.primaryBtn}>Save Hours</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW MODAL */}
      {showAddNew && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Add Break / Holiday</h3>
              <button onClick={() => setShowAddNew(false)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <p>Select break or holiday details.</p>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setShowAddNew(false)}>Cancel</button>
              <button className={styles.primaryBtn}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
