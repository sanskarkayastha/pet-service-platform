"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import styles from "../page.module.css";
import apiClient from "@/lib/api-client";

interface DayHours {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  breakStartTime: string;
  breakEndTime: string;
}

const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function WorkingHoursPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workingHours, setWorkingHours] = useState<DayHours[]>([]);

  useEffect(() => {
    loadWorkingHours();
  }, []);

  const loadWorkingHours = async () => {
    try {
      const response = await apiClient.get("/api/working-hours/my-hours");
      const data = response.data;

      if (data.length === 0) {
        const defaultHours: DayHours[] = DAYS_OF_WEEK.map((day) => ({
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "18:00",
          isAvailable: true,
          breakStartTime: "",
          breakEndTime: "",
        }));
        setWorkingHours(defaultHours);
      } else {
        const allHours: DayHours[] = DAYS_OF_WEEK.map((day) => {
          const existing = data.find((wh: { dayOfWeek: string }) => wh.dayOfWeek === day);
          if (existing) {
            return {
              dayOfWeek: day,
              startTime: existing.startTime || "09:00",
              endTime: existing.endTime || "18:00",
              isAvailable: existing.isAvailable !== false,
              breakStartTime: existing.breakStartTime || "",
              breakEndTime: existing.breakEndTime || "",
            };
          }
          return {
            dayOfWeek: day,
            startTime: "09:00",
            endTime: "18:00",
            isAvailable: false,
            breakStartTime: "",
            breakEndTime: "",
          };
        });
        setWorkingHours(allHours);
      }
    } catch {
      const defaultHours: DayHours[] = DAYS_OF_WEEK.map((day) => ({
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "18:00",
        isAvailable: true,
        breakStartTime: "",
        breakEndTime: "",
      }));
      setWorkingHours(defaultHours);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    index: number,
    field: keyof DayHours,
    value: string | boolean
  ) => {
    const updated = [...workingHours];
    updated[index] = { ...updated[index], [field]: value };
    setWorkingHours(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put("/api/working-hours/update", {
        days: workingHours.map((wh) => ({
          dayOfWeek: wh.dayOfWeek,
          startTime: wh.startTime,
          endTime: wh.endTime,
          isAvailable: wh.isAvailable,
          breakStartTime: wh.breakStartTime || null,
          breakEndTime: wh.breakEndTime || null,
        })),
      });
      alert("Working hours updated successfully!");
    } catch (error) {
      console.error("Failed to update working hours:", error);
      alert("Failed to update working hours");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.mainContent}>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className={styles.mainContent}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h1>Working Hours</h1>
          <p>Set your business hours and break times</p>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Hours"}
        </button>
      </div>

      <div className={styles.bookingsSection}>
        <h4 style={{ marginBottom: "20px", color: "#666" }}>WEEKLY SCHEDULE</h4>

        <div style={{ display: "grid", gap: "15px" }}>
          {workingHours.map((day, index) => (
            <div
              key={day.dayOfWeek}
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr 1fr 1fr 1fr auto",
                gap: "15px",
                alignItems: "center",
                padding: "15px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                backgroundColor: day.isAvailable ? "white" : "#f5f5f5",
                color:"grey",
              }}
            >
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="checkbox"
                    checked={day.isAvailable}
                    onChange={(e) =>
                      handleChange(index, "isAvailable", e.target.checked)
                    }
                  />
                  <span style={{ fontWeight: "500" }}>
                    {day.dayOfWeek.charAt(0) + day.dayOfWeek.slice(1).toLowerCase()}
                  </span>
                </label>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "grey",
                    marginBottom: "5px",
                    backgroundColor:"white"
                  }}
                >
                  Start Time
                </label>
                <input
                  type="time"
                  value={day.startTime}
                  onChange={(e) => handleChange(index, "startTime", e.target.value)}
                  disabled={!day.isAvailable}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor:"white",
                    color: "grey",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#999",
                    marginBottom: "5px",
                  }}
                >
                  End Time
                </label>
                <input
                  type="time"
                  value={day.endTime}
                  onChange={(e) => handleChange(index, "endTime", e.target.value)}
                  disabled={!day.isAvailable}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor:"white",
                    color: "grey",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#999",
                    marginBottom: "5px",
                  }}
                >
                  Break Start
                </label>
                <input
                  type="time"
                  value={day.breakStartTime}
                  onChange={(e) =>
                    handleChange(index, "breakStartTime", e.target.value)
                  }
                  disabled={!day.isAvailable}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor:"white",
                    color: "grey",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#999",
                    marginBottom: "5px",
                  }}
                >
                  Break End
                </label>
                <input
                  type="time"
                  value={day.breakEndTime}
                  onChange={(e) =>
                    handleChange(index, "breakEndTime", e.target.value)
                  }
                  disabled={!day.isAvailable}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor:"white",
                    color: "grey",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
