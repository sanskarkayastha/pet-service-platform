"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./receipt.module.css";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import apiClient from "@/lib/api-client";

type BookingAddon = {
  id: number;
  name: string;
  description: string;
  price: number;
};

type Booking = {
  id: number;
  businessName: string;
  serviceTitle: string;
  bookingDateTime: string;
  endDateTime: string;
  totalPrice: number;
  addons: BookingAddon[];
};

export default function ReceiptPage({
  searchParams,
}: {
  searchParams: { bookingId?: string };
}) {
  const bookingId = searchParams.bookingId;
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const res = await apiClient.get<Booking>(`/api/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        console.error("Failed to load booking", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId]);

  if (!bookingId) {
    return (
      <div className={styles.pagebg}>
        <div className={styles.wrapper}>
          <p>Missing booking reference.</p>
        </div>
      </div>
    );
  }

  if (loading || !booking) {
    return (
      <div className={styles.pagebg}>
        <div className={styles.wrapper}>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  const dateLabel = new Date(booking.bookingDateTime).toLocaleDateString();
  const timeLabel = new Date(booking.bookingDateTime).toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" },
  );

  const basePrice = booking.totalPrice;

  return (
    <div className={styles.pagebg}>
      <div className={styles.wrapper}>
        {/* Top Back */}
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.backBtn}
        >
          <ArrowLeft size={20} /> Back to Details
        </button>

        <header className={styles.header}>
          <h2 className={styles.title}>Booking Receipt</h2>
          <p className={styles.subtitle}>
            Review your appointment details before payment
          </p>
        </header>

        <div className={styles.topSection}>
          <div className={styles.box}>
            <Calendar size={20} className={styles.icon} />
            <div>
              <div className={styles.label}>Date</div>
              <div className={styles.value}>{dateLabel}</div>
            </div>
          </div>

          <div className={styles.box}>
            <Clock size={20} className={styles.icon} />
            <div>
              <div className={styles.label}>Time</div>
              <div className={styles.value}>{timeLabel}</div>
            </div>
          </div>
        </div>

        <div className={styles.servicesTitle}>Services</div>

        <div className={styles.serviceCard}>
          <div className={styles.serviceTop}>
            <div className={styles.serviceName}>{booking.serviceTitle}</div>
            <div className={styles.servicePrice}>Rs {basePrice.toFixed(2)}</div>
          </div>

          {booking.addons && booking.addons.length > 0 && (
            <div className={styles.addonWrap}>
              {booking.addons.map((a) => (
                <div key={a.id} className={styles.addonItem}>
                  + {a.name} (Rs {a.price})
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.summaryRow}>
          <span>Total</span>
          <span className={styles.totalValue}>Rs {basePrice.toFixed(2)}</span>
        </div>

        <Link
          href={`/users/petServices/grooming/detail/receipt/payment?bookingId=${booking.id}`}
          className={styles.payBtn}
        >
          Proceed to Payment
        </Link>
      </div>
    </div>
  );
}
