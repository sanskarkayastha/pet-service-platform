"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api-fetch";
import styles from "../../page.module.css";

interface Service {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  price: number;
  addons: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
  }>;
}

interface WorkingHours {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  breakStartTime: string | null;
  breakEndTime: string | null;
}

interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as string;

  const [services, setServices] = useState<Service[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [petName, setPetName] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (businessId) {
      loadBusinessData();
    }
  }, [businessId]);

  useEffect(() => {
    if (selectedDate && selectedService) {
      generateTimeSlots();
    }
  }, [selectedDate, selectedService, workingHours]);

  const loadBusinessData = async () => {
    try {
      const [servicesRes, hoursRes] = await Promise.all([
        apiGet<Service[]>(`/api/services/business/${businessId}`),
        apiGet<WorkingHours[]>(`/api/working-hours/business/${businessId}`),
      ]);

      setServices(servicesRes);
      setWorkingHours(hoursRes);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split("T")[0]);
    } catch (error) {
      console.error("Failed to load business data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    if (!selectedService || !selectedDate) return;

    const selectedDay = new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    const dayHours = workingHours.find((wh) => wh.dayOfWeek === selectedDay);

    if (!dayHours || !dayHours.isAvailable) {
      setAvailableSlots([]);
      return;
    }

    const slots: TimeSlot[] = [];
    const start = new Date(`${selectedDate}T${dayHours.startTime}`);
    const end = new Date(`${selectedDate}T${dayHours.endTime}`);
    const breakStart = dayHours.breakStartTime ? new Date(`${selectedDate}T${dayHours.breakStartTime}`) : null;
    const breakEnd = dayHours.breakEndTime ? new Date(`${selectedDate}T${dayHours.breakEndTime}`) : null;
    const serviceDuration = selectedService.durationMinutes;
    let current = new Date(start);

    while (current < end) {
      const slotEnd = new Date(current.getTime() + serviceDuration * 60000);
      const isDuringBreak =
        breakStart && breakEnd &&
        ((current >= breakStart && current < breakEnd) || (slotEnd > breakStart && slotEnd <= breakEnd));

      if (!isDuringBreak && slotEnd <= end) {
        slots.push({ date: selectedDate, time: current.toTimeString().slice(0, 5), available: true });
      }
      current.setMinutes(current.getMinutes() + 30);
    }
    setAvailableSlots(slots);
  };

  const calculateTotal = () => {
    if (!selectedService) return 0;
    let total = selectedService.price;
    selectedAddons.forEach((addonId) => {
      const addon = selectedService.addons.find((a) => a.id === addonId);
      if (addon) total += addon.price;
    });
    return total;
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      alert("Please select a service, date, and time");
      return;
    }
    if (!customerName || !customerEmail || !customerPhone) {
      alert("Please fill in customer information");
      return;
    }

    setSubmitting(true);
    try {
      const bookingDateTime = new Date(`${selectedDate}T${selectedTime}`);
      await apiPost("/api/bookings/create", {
        serviceId: selectedService.id,
        bookingDateTime: bookingDateTime.toISOString(),
        customerName,
        customerEmail,
        customerPhone,
        petName,
        petBreed,
        notes,
        addonIds: selectedAddons,
      });
      alert("Booking created successfully!");
      router.push(`/users/petServices/grooming`);
    } catch (error: unknown) {
      const err = error as { message?: string };
      alert("Failed to create booking: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: "40px", textAlign: "center" }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.bookingPage}>
        <header className={styles.bookingHeader}>
          <h1 className={styles.bookingTitle}>Book a service</h1>
          <p className={styles.bookingSubtitle}>
            Choose a service, pick a time and share your pet&apos;s details in a few simple steps.
          </p>
        </header>

        <div className={styles.bookingLayout}>
          {/* Left: form */}
          <div className={styles.bookingCard}>
            <section>
              <h2 className={styles.bookingSectionTitle}>Select service</h2>
              <div className={styles.serviceList}>
                {services.map((service) => {
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className={`${styles.serviceOption} ${
                        isSelected ? styles.serviceOptionSelected : ""
                      }`}
                    >
                      <div className={styles.serviceHeader}>
                        <div>
                          <h3 className={styles.serviceTitle}>{service.title}</h3>
                          <p className={styles.serviceDescription}>{service.description}</p>
                          <p className={styles.serviceMeta}>
                            Duration: {service.durationMinutes} minutes
                          </p>
                        </div>
                        <div className={styles.servicePrice}>Rs {service.price}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {selectedService && selectedService.addons && selectedService.addons.length > 0 && (
              <section style={{ marginTop: "28px" }}>
                <h3 className={styles.bookingSectionTitle}>Add-ons (optional)</h3>
                <div className={styles.addonList}>
                  {selectedService.addons.map((addon) => (
                    <label key={addon.id} className={styles.addonItem}>
                      <input
                        type="checkbox"
                        checked={selectedAddons.includes(addon.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAddons([...selectedAddons, addon.id]);
                          } else {
                            setSelectedAddons(
                              selectedAddons.filter((id) => id !== addon.id)
                            );
                          }
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div className={styles.addonContentTitle}>{addon.name}</div>
                        {addon.description && (
                          <p className={styles.addonContentDescription}>
                            {addon.description}
                          </p>
                        )}
                      </div>
                      <div className={styles.addonPrice}>+Rs {addon.price}</div>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {selectedService && (
              <>
                <section style={{ marginTop: "28px" }}>
                  <h3 className={styles.bookingSectionTitle}>Choose date</h3>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className={styles.dateInput}
                  />
                </section>

                <section style={{ marginTop: "24px" }}>
                  <h3 className={styles.bookingSectionTitle}>Choose time</h3>
                  {availableSlots.length === 0 ? (
                    <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                      No available time slots for this date.
                    </p>
                  ) : (
                    <div className={styles.timeGrid}>
                      {availableSlots.map((slot, index) => {
                        const isSelected = selectedTime === slot.time;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedTime(slot.time)}
                            className={`${styles.timeButton} ${
                              isSelected ? styles.timeButtonSelected : ""
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              </>
            )}

            <section style={{ marginTop: "28px" }}>
              <h3 className={styles.bookingSectionTitle}>Customer & pet details</h3>
              <div className={styles.fieldGrid}>
                <input
                  type="text"
                  placeholder="Your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={styles.textField}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className={styles.textField}
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={styles.textField}
                />
                <input
                  type="text"
                  placeholder="Pet name (optional)"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className={styles.textField}
                />
                <input
                  type="text"
                  placeholder="Pet breed (optional)"
                  value={petBreed}
                  onChange={(e) => setPetBreed(e.target.value)}
                  className={styles.textField}
                />
                <textarea
                  placeholder="Additional notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className={styles.textArea}
                />
              </div>
            </section>
          </div>

          {/* Right: summary */}
          <aside className={`${styles.bookingCard} ${styles.summaryCard}`}>
            <h2 className={styles.bookingSectionTitle}>Booking summary</h2>

            {selectedService ? (
              <>
                <div>
                  <div className={styles.summaryRow}>
                    <span>{selectedService.title}</span>
                    <span>Rs {selectedService.price}</span>
                  </div>
                  {selectedAddons.map((addonId) => {
                    const addon = selectedService.addons.find((a) => a.id === addonId);
                    if (!addon) return null;
                    return (
                      <div
                        key={addonId}
                        className={styles.summaryRow}
                        style={{ fontSize: "0.85rem", color: "#6b7280" }}
                      >
                        <span>+ {addon.name}</span>
                        <span>Rs {addon.price}</span>
                      </div>
                    );
                  })}
                  <hr className={styles.summaryDivider} />
                  <div className={styles.summaryTotal}>
                    <span>Total</span>
                    <span>Rs {calculateTotal()}</span>
                  </div>
                </div>

                {selectedDate && selectedTime && (
                  <div className={styles.summaryDatePill}>
                    <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                      Date &amp; time
                    </div>
                    <div style={{ fontWeight: 500 }}>
                      {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !selectedDate || !selectedTime}
                  className={styles.primaryButton}
                >
                  {submitting ? "Booking..." : "Confirm booking"}
                </button>
              </>
            ) : (
              <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                Select a service to see the summary and confirm your booking.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
