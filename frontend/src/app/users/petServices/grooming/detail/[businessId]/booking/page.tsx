"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../../page.module.css";
import { authClient } from "@/lib/auth-client";
import apiClient from "@/lib/api-client";

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

interface TimeSlot {
  start: string;
  end: string;
  capacity: number;
  bookedCount: number;
  blocked: boolean;
  full: boolean;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as string;

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlotStart, setSelectedSlotStart] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

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
      loadTimeSlots(selectedService.id, selectedDate);
    }
  }, [selectedDate, selectedService]);

  // Prefill customer info from session
  useEffect(() => {
    const fillFromSession = async () => {
      try {
        const session = await authClient.getSession();
        const user = session?.data?.user;
        if (user) {
          if (!customerName) setCustomerName(user.name || "");
          if (!customerEmail) setCustomerEmail(user.email || "");
          // phone/phoneNumber may vary depending on auth setup
          const phone = (user as any).phone || (user as any).phoneNumber;
          if (!customerPhone && phone) setCustomerPhone(phone);
        }
      } catch (err) {
        console.error("Failed to load session for booking form:", err);
      }
    };
    fillFromSession();
    // we intentionally omit dependencies to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBusinessData = async () => {
    try {
      const servicesRes = await apiClient.get<Service[]>(
        `/api/services/business/${businessId}`,
      );

      setServices(servicesRes.data);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split("T")[0]);
    } catch (error) {
      console.error("Failed to load business data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTimeSlots = async (serviceId: number, date: string) => {
    try {
      const res = await apiClient.get<TimeSlot[]>(
        `/api/time-slots/business/${businessId}/service/${serviceId}?date=${date}`,
      );
      // Only keep slots that are not blocked and not full
      const slots = res.data.filter((s) => !s.blocked && !s.full);
      setAvailableSlots(slots);
      setSelectedSlotStart(""); // reset previously selected slot when reloading
    } catch (error) {
      console.error("Failed to load time slots:", error);
      setAvailableSlots([]);
      setSelectedSlotStart("");
    }
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
    if (!selectedService || !selectedDate || !selectedSlotStart) {
      alert("Please select a service, date, and time slot");
      return;
    }
    if (!customerName || !customerEmail || !customerPhone) {
      alert("Please fill in customer information");
      return;
    }

    setSubmitting(true);
    setErrorToast(null);
    try {
      const res = await apiClient.post<{
        id: number;
      }>("/api/bookings/create", {
        serviceId: selectedService.id,
        // Send the exact local date-time string from the slot,
        // so it matches backend LocalDateTime and working hours.
        bookingDateTime: selectedSlotStart,
        customerName,
        customerEmail,
        customerPhone,
        petName,
        petBreed,
        notes,
        addonIds: selectedAddons,
      });
      alert("Booking created successfully!");
      router.push(
        `/users/petServices/grooming/detail/receipt?bookingId=${res.data.id}`,
      );
    } catch (error: any) {
      const backendMessage: string | undefined = error?.response?.data;
      const genericMessage =
        "We couldn't complete this booking. Please try another time or slot.";

      if (
        error?.response?.status === 400 &&
        typeof backendMessage === "string" &&
        backendMessage.toLowerCase().includes("slot is full")
      ) {
        setErrorToast(
          "That time slot has just been fully booked. Please pick a different time.",
        );
      } else {
        setErrorToast(
          typeof backendMessage === "string" && backendMessage.length < 160
            ? backendMessage
            : genericMessage,
        );
      }
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
      {errorToast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            maxWidth: "320px",
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            padding: "12px 16px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            fontSize: "0.9rem",
            zIndex: 40,
          }}
          onClick={() => setErrorToast(null)}
        >
          <strong style={{ display: "block", marginBottom: 4 }}>
            Booking not completed
          </strong>
          <span>{errorToast}</span>
          <div style={{ marginTop: 6, fontSize: "0.8rem", opacity: 0.8 }}>
            Tap to dismiss.
          </div>
        </div>
      )}
      <div className={styles.bookingPage}>
        <header className={styles.bookingHeader}>
          <h1 className={styles.bookingTitle}>Book a service</h1>
          <p className={styles.bookingSubtitle}>
            Choose a service, pick a time and share your pet&apos;s details in a
            few simple steps.
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
                          <h3 className={styles.serviceTitle}>
                            {service.title}
                          </h3>
                          <p className={styles.serviceDescription}>
                            {service.description}
                          </p>
                          <p className={styles.serviceMeta}>
                            Duration: {service.durationMinutes} minutes
                          </p>
                        </div>
                        <div className={styles.servicePrice}>
                          Rs {service.price}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {selectedService &&
              selectedService.addons &&
              selectedService.addons.length > 0 && (
                <section style={{ marginTop: "28px" }}>
                  <h3 className={styles.bookingSectionTitle}>
                    Add-ons (optional)
                  </h3>
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
                                selectedAddons.filter((id) => id !== addon.id),
                              );
                            }
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div className={styles.addonContentTitle}>
                            {addon.name}
                          </div>
                          {addon.description && (
                            <p className={styles.addonContentDescription}>
                              {addon.description}
                            </p>
                          )}
                        </div>
                        <div className={styles.addonPrice}>
                          +Rs {addon.price}
                        </div>
                      </label>
                    ))}
                  </div>
                </section>
              )}

            {selectedService && (
              <>
                <section
                  style={{
                    marginTop: "28px",
                    backgroundColor: "white",
                    color: "black",
                    padding: "16px",
                  }}
                >
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
                        const startLabel = new Date(
                          slot.start,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        const isSelected = selectedSlotStart === slot.start;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedSlotStart(slot.start)}
                            className={`${styles.timeButton} ${
                              isSelected ? styles.timeButtonSelected : ""
                            }`}
                          >
                            {startLabel}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              </>
            )}

            <section style={{ marginTop: "28px" }}>
              <h3 className={styles.bookingSectionTitle}>
                Customer & pet details
              </h3>
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
                    const addon = selectedService.addons.find(
                      (a) => a.id === addonId,
                    );
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

                {selectedDate && selectedSlotStart && (
                  <div className={styles.summaryDatePill}>
                    <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                      Date &amp; time
                    </div>
                    <div style={{ fontWeight: 500 }}>
                      {new Date(selectedDate).toLocaleDateString()} at{" "}
                      {new Date(selectedSlotStart).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !selectedDate || !selectedSlotStart}
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
