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
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "30px" }}>Book a Service</h1>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
        <div>
          <h2 style={{ marginBottom: "20px" }}>Select Service</h2>
          <div style={{ display: "grid", gap: "15px" }}>
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                style={{
                  padding: "20px",
                  border: selectedService?.id === service.id ? "2px solid #9c27b0" : "1px solid #e0e0e0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: selectedService?.id === service.id ? "#f3e5f5" : "white",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <h3 style={{ margin: "0 0 10px 0" }}>{service.title}</h3>
                    <p style={{ color: "#666", margin: "0 0 10px 0" }}>{service.description}</p>
                    <p style={{ fontSize: "14px", color: "#999" }}>Duration: {service.durationMinutes} minutes</p>
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: "bold", color: "#9c27b0" }}>Rs {service.price}</div>
                </div>
              </div>
            ))}
          </div>

          {selectedService && selectedService.addons && selectedService.addons.length > 0 && (
            <div style={{ marginTop: "30px" }}>
              <h3 style={{ marginBottom: "15px" }}>Add-ons (Optional)</h3>
              <div style={{ display: "grid", gap: "10px" }}>
                {selectedService.addons.map((addon) => (
                  <label
                    key={addon.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAddons.includes(addon.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedAddons([...selectedAddons, addon.id]);
                        else setSelectedAddons(selectedAddons.filter((id) => id !== addon.id));
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong>{addon.name}</strong>
                      <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#666" }}>{addon.description}</p>
                    </div>
                    <div style={{ fontWeight: "bold" }}>+Rs {addon.price}</div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {selectedService && (
            <div style={{ marginTop: "30px" }}>
              <h3 style={{ marginBottom: "15px" }}>Select Date</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                style={{ width: "100%", padding: "10px", border: "1px solid #e0e0e0", borderRadius: "6px", fontSize: "16px" }}
              />
            </div>
          )}

          {selectedService && selectedDate && (
            <div style={{ marginTop: "30px" }}>
              <h3 style={{ marginBottom: "15px" }}>Select Time</h3>
              {availableSlots.length === 0 ? (
                <p style={{ color: "#999" }}>No available time slots for this date.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "10px" }}>
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(slot.time)}
                      style={{
                        padding: "10px",
                        border: selectedTime === slot.time ? "2px solid #9c27b0" : "1px solid #e0e0e0",
                        borderRadius: "6px",
                        background: selectedTime === slot.time ? "#f3e5f5" : "white",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: "30px" }}>
            <h3 style={{ marginBottom: "15px" }}>Customer Information</h3>
            <div style={{ display: "grid", gap: "15px" }}>
              <input type="text" placeholder="Your Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={{ padding: "10px", border: "1px solid #e0e0e0", borderRadius: "6px", fontSize: "14px" }} />
              <input type="email" placeholder="Email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} style={{ padding: "10px", border: "1px solid #e0e0e0", borderRadius: "6px", fontSize: "14px" }} />
              <input type="tel" placeholder="Phone Number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} style={{ padding: "10px", border: "1px solid #e0e0e0", borderRadius: "6px", fontSize: "14px" }} />
              <input type="text" placeholder="Pet Name (Optional)" value={petName} onChange={(e) => setPetName(e.target.value)} style={{ padding: "10px", border: "1px solid #e0e0e0", borderRadius: "6px", fontSize: "14px" }} />
              <input type="text" placeholder="Pet Breed (Optional)" value={petBreed} onChange={(e) => setPetBreed(e.target.value)} style={{ padding: "10px", border: "1px solid #e0e0e0", borderRadius: "6px", fontSize: "14px" }} />
              <textarea placeholder="Additional Notes (Optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ padding: "10px", border: "1px solid #e0e0e0", borderRadius: "6px", fontSize: "14px", resize: "vertical" }} />
            </div>
          </div>
        </div>

        <div style={{ position: "sticky", top: "20px", height: "fit-content", padding: "20px", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "white" }}>
          <h2 style={{ marginBottom: "20px" }}>Booking Summary</h2>

          {selectedService ? (
            <>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span>{selectedService.title}</span>
                  <span>Rs {selectedService.price}</span>
                </div>
                {selectedAddons.map((addonId) => {
                  const addon = selectedService.addons.find((a) => a.id === addonId);
                  return addon ? (
                    <div key={addonId} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#666" }}>
                      <span>+ {addon.name}</span>
                      <span>Rs {addon.price}</span>
                    </div>
                  ) : null;
                })}
                <hr style={{ margin: "15px 0", border: "none", borderTop: "1px solid #e0e0e0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "18px" }}>
                  <span>Total</span>
                  <span>Rs {calculateTotal()}</span>
                </div>
              </div>

              {selectedDate && selectedTime && (
                <div style={{ marginBottom: "20px", padding: "15px", background: "#f5f5f5", borderRadius: "6px" }}>
                  <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>Date & Time</p>
                  <p style={{ margin: 0, fontWeight: "500" }}>{new Date(selectedDate).toLocaleDateString()} at {selectedTime}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting || !selectedDate || !selectedTime}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: submitting || !selectedDate || !selectedTime ? "#ccc" : "linear-gradient(135deg, #9c27b0, #7b1fa2)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: submitting || !selectedDate || !selectedTime ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </>
          ) : (
            <p style={{ color: "#999" }}>Select a service to continue</p>
          )}
        </div>
      </div>
    </div>
  );
}
