"use client";

import { ArrowLeft, Lock, CreditCard, Wallet, Landmark } from "lucide-react";
import Link from "next/link";
import styles from "./payment.module.css";

export default function PaymentPage() {
  const total = 100.1001; // replace with real total if needed

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
        <button className={styles.confirmBtn}>Confirm payment</button>

        <div className={styles.securityNote}>
            <Lock size={16} className={styles.lockIcon} />
            <span>Your payment is secure and encrypted</span>
        </div>

        </div>
    </div>
  );
}
