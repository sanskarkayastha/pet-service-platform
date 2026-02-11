"use client";

import { ArrowLeft, Lock, CreditCard, Wallet, Landmark } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./payment.module.css";
import apiClient from "@/lib/api-client";

type Booking = {
  id: number;
  totalPrice: number;
};

export default function PaymentPage({
  searchParams,
}: {
  searchParams: { bookingId?: string };
}) {
  const bookingId = searchParams.bookingId;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        console.error("Failed to load booking for payment", err);
        setError("Unable to load booking for payment.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId]);

  const handleConfirm = async () => {
    if (!bookingId) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.put(`/api/bookings/${bookingId}/status`, {
        status: "CONFIRMED",
        message: "Paid online",
      });
      router.push("/users/profile/bookings");
    } catch (err) {
      console.error("Failed to confirm payment", err);
      setError("Payment was processed, but we couldn't update the booking. Please check your bookings.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!bookingId) {
    return (
      <div className={styles.backgroundColor}>
        <div className={styles.wrapper}>
          <p>Missing booking reference.</p>
        </div>
      </div>
    );
  }

  if (loading || !booking) {
    return (
      <div className={styles.backgroundColor}>
        <div className={styles.wrapper}>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  const total = booking.totalPrice;

  return (
    <div className={styles.backgroundColor}>
        <div className={styles.wrapper}>
        {/* Top Back */}
        <Link href="/users/petServices/grooming/detail/receipt" className={styles.backBtn}>
            <ArrowLeft size={20} /> Back to Receipt
        </Link>

        {/* Header */}
        <header className={styles.header}>
            <h2 className={styles.title}>Choose Payment Method</h2>
            <p className={styles.subtitle}>
            Select your preferred payment option to complete bookings
            </p>
        </header>

        {/* Total Box */}
        <div className={styles.totalBox}>
            <div className={styles.totalLabel}>Total Payment</div>
            <div className={styles.totalAmount}>Rs {total}</div>
            <CreditCard className={styles.totalIcon} size={26} />
        </div>

        {/* Payment Options */}
        <div className={styles.sectionLabel}>SELECT A PAYMENT METHOD</div>

        <div className={styles.paymentOption}>
            <div className={styles.left}>
            <Wallet size={28} className={styles.iconEsewa} />
            <div>
                <div className={styles.paymentTitle}>eSewa</div>
                <div className={styles.paymentDesc}>Pay with your eSewa digital wallet</div>
            </div>
            </div>
            <label className={styles.radioWrap}>
            <input type="radio" name="method" className={styles.radio} />
            <div className={styles.customRadio}></div>
            </label>
        </div>

        <div className={styles.paymentOptionKhalti}>
            <div className={styles.left}>
            <Wallet size={28} className={styles.iconKhalti} />
            <div>
                <div className={styles.paymentTitle}>Khalti</div>
                <div className={styles.paymentDesc}>Pay with your Khalti digital wallet</div>
            </div>
            </div>
            <label className={styles.radioWrap}>
            <input type="radio" name="method" className={styles.radio} />
            <div className={styles.customRadio}></div>
            </label>
        </div>

        <div className={styles.paymentOptionBank}>
            <div className={styles.left}>
            <Landmark size={28} className={styles.iconBank} />
            <div>
                <div className={styles.paymentTitle}>Bank Transfer</div>
                <div className={styles.paymentDesc}>Pay directly from your bank account</div>
            </div>
            </div>
            <label className={styles.radioWrap}>
            <input type="radio" name="method" className={styles.radio} />
            <div className={styles.customRadio}></div>
            </label>
        </div>

        {/* Confirm Button */}
        {error && (
          <div
            style={{
              marginBottom: 8,
              padding: "8px 10px",
              borderRadius: 8,
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: "0.85rem",
            }}
          >
            {error}
          </div>
        )}
        <button
          className={styles.confirmBtn}
          onClick={handleConfirm}
          disabled={submitting}
        >
          {submitting ? "Processing..." : "Confirm payment"}
        </button>

        <div className={styles.securityNote}>
            <Lock size={16} className={styles.lockIcon} />
            <span>Your payment is secure and encrypted</span>
        </div>

        </div>
    </div>
  );
}
