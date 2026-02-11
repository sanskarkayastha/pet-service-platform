"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import apiClient from "@/lib/api-client";

type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

interface TimeSlot {
  id: number;
  start: string;
  end: string;
  capacity: number;
  bookedCount: number;
  blocked: boolean;
  full: boolean;
}

export default function BookingCalendarPage() {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newCapacity, setNewCapacity] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadSlots();
  }, [selectedDate]);

  const loadSlots = async () => {
    try {
      setError(null);
      setSuccess(null);
      const res = await apiClient.get<TimeSlot[]>(
        `/api/time-slots/my?date=${selectedDate}`,
      );
      setSlots(res.data);
    } catch (err) {
      console.error("Failed to load slots", err);
      setError("Failed to load time slots for this day.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      if (!newStartTime || !newEndTime || !newCapacity) {
        setError("Please fill all fields to create a slot.");
        return;
      }

      await apiClient.post("/api/time-slots/my", {
        date: selectedDate,
        startTime: newStartTime,
        endTime: newEndTime,
        // reuse 'reason' field on backend as capacity
        reason: newCapacity,
      });

      setNewStartTime("");
      setNewEndTime("");
      setNewCapacity("");
      await loadSlots();
      setSuccess("Slot created successfully.");
    } catch (err) {
      console.error("Failed to create slot", err);
      setError("Failed to create slot. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slotId: number) => {
    try {
      setError(null);
      setSuccess(null);
      await apiClient.delete(
        `/api/time-slots/my/${slotId}`,
      );
      await loadSlots();
      setSuccess("Slot deleted.");
    } catch (err) {
      console.error("Failed to delete slot", err);
      setError("Failed to delete slot.");
    }
  };

  if (loading) {
    return (
      <div className={styles.layout}>
        <main className={styles.main}>
          <p>Loading working hours...</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <h1>Booking Slots & Capacity</h1>
            <p>Create and manage per-day time slots and max pets per slot.</p>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.title}>Per-day time slots</h3>
          <p className={styles.subtitle}>
            Pick a date, then add one or more time slots with capacity. Customers
            will only see slots that are not yet full.
          </p>

          {error && (
            <div className={styles.errorBanner}>
              {error}
            </div>
          )}
          {success && (
            <div className={styles.successBanner}>
              {success}
            </div>
          )}

          <div className={styles.dateRow}>
            <label>Select date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className={styles.slotForm}>
            <h4>Create a new slot</h4>
            <div className={styles.timeInputs}>
              <div>
                <label>Start</label>
                <input
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                />
              </div>
              <div>
                <label>End</label>
                <input
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                />
              </div>
              <div>
                <label>Max pets</label>
                <input
                  type="number"
                  min={1}
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.footer}>
              <button
                className={styles.primaryBtn}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Add slot"}
              </button>
            </div>
          </div>

          <div className={styles.slotList}>
            <h4>Slots for this day</h4>
            {slots.length === 0 ? (
              <p className={styles.emptyState}>
                No slots for this date yet. Add at least one time slot above.
              </p>
            ) : (
              slots.map((slot) => {
                const start = new Date(slot.start);
                const end = new Date(slot.end);
                const startLabel = start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const endLabel = end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const remaining = slot.capacity - slot.bookedCount;
                return (
                  <div key={slot.id} className={styles.slotRow}>
                    <div>
                      <div className={styles.slotTime}>
                        {startLabel} – {endLabel}
                      </div>
                      <div className={styles.slotMeta}>
                        Capacity {slot.capacity} •{" "}
                        {slot.bookedCount} booked •{" "}
                        {remaining > 0 ? `${remaining} left` : "FULL"}
                      </div>
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(slot.id)}
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={styles.helperText}>
          Customers will see only non-full slots for this date when booking. Use
          this screen to open or close specific times and control capacity.
        </div>
      </main>
    </div>
  );
}
