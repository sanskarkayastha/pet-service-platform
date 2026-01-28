"use client";

import Link from "next/link";

import styles from "./receipt.module.css";
import {ArrowLeft, Calendar, Clock } from "lucide-react";

export default function ReceiptPage() {
  const date = "November 30th, 2025";
  const time = "17:00";

  const services = [
    {
      id: 1,
      title: "Full Grooming Package",
      duration: "2–3 Hours",
      price: 75,
      addons: []
    },
    {
      id: 2,
      title: "Full Grooming Package",
      duration: "2–3 Hours",
      price: 75,
      addons: []
    },
    {
      id: 3,
      title: "Full Grooming Package",
      duration: "2–3 Hours",
      price: 75,
      addons: [
        { id: 1, name: "Training Treats" },
        { id: 2, name: "Comfort Toy" }
      ]
    }
  ];

  const subtotal = services.length * 75;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className={styles.pagebg}>
    <div className={styles.wrapper}>

     {/* Top Back */}
        <Link href="/services/grooming/detail" className={styles.backBtn}>
            <ArrowLeft size={20} /> Back to Details
        </Link>

      <header className={styles.header}>
        <h2 className={styles.title}>Booking Receipt</h2>
        <p className={styles.subtitle}>Review your appointment details before payment</p>
      </header>

      <div className={styles.topSection}>
        <div className={styles.box}>
          <Calendar size={20} className={styles.icon} />
          <div>
            <div className={styles.label}>Date</div>
            <div className={styles.value}>{date}</div>
          </div>
        </div>

        <div className={styles.box}>
          <Clock size={20} className={styles.icon} />
          <div>
            <div className={styles.label}>Time</div>
            <div className={styles.value}>{time}</div>
          </div>
        </div>
      </div>

      <div className={styles.servicesTitle}>Services</div>

      {services.map((s) => (
        <div key={s.id} className={styles.serviceCard}>
          <div className={styles.serviceTop}>
            <div className={styles.serviceName}>{s.title}</div>
            <div className={styles.servicePrice}>${s.price.toFixed(2)}</div>
          </div>

          <div className={styles.duration}>{s.duration}</div>

          {s.addons.length > 0 && (
            <div className={styles.addonWrap}>
              {s.addons.map((a) => (
                <div key={a.id} className={styles.addonItem}>+ {a.name}</div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className={styles.summaryRow}>
        <span>Sub Total</span>
        <span className={styles.subtotal}>${subtotal.toFixed(2)}</span>
      </div>

      <div className={styles.summaryRow}>
        <span>Tax (10%)</span>
        <span className={styles.tax}>${tax.toFixed(2)}</span>
      </div>

      <div className={styles.totalBox}>
        <span>Total Amount</span>
        <span className={styles.totalValue}>${total.toFixed(2)}</span>
      </div>

      <Link href="/users/petServices/grooming/detail/receipt/payment" className={styles.payBtn}>
        Proceed to Payment
      </Link>
    </div>
    </div>
  );
}
