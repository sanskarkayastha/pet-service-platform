"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./RegisterBusiness.module.css";

type BusinessStatusType = "NOT_APPLIED" | "PENDING" | "APPROVED";

interface BusinessStatusResponse {
  status: BusinessStatusType;
}

export default function RegisterBusiness() {
  const [status, setStatus] = useState<BusinessStatusType | null>(null);
  const [loading, setLoading] = useState(true);

  // Replace this with your actual session logic
  const userId = "user-session-id"; // Example: get this from session/auth context

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get<BusinessStatusResponse>(
          `http://localhost:8080/getBusinessStatus/${userId}`
        );
        setStatus(res.data.status);
      } catch (err) {
        console.error("Error fetching business status:", err);
        setStatus("NOT_APPLIED"); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [userId]);

  if (loading) return <p className={styles.loading}>Loading...</p>;

  // Determine content based on business status
  let title = "";
  let description = "";
  let btn = null;

  switch (status) {
    case "NOT_APPLIED":
      title = "Register Your Business";
      description = "Join our Furrever family and grow your pet care business!";
      btn = (
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => console.log("Redirect to registration page")}
        >
          Register Your Business
        </button>
      );
      break;

    case "PENDING":
      title = "Business Pending Approval";
      description = "Your business is being reviewed. Please wait patiently.";
      btn = null; // No button while pending
      break;

    case "APPROVED":
      title = "Welcome Back!";
      description = "Your business is approved. Manage your dashboard now.";
      btn = (
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => console.log("Redirect to dashboard")}
        >
          Go to Dashboard
        </button>
      );
      break;

    default:
      title = "Register Your Business";
      description = "Join our Furrever family and grow your pet care business!";
      btn = (
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => console.log("Redirect to registration page")}
        >
          Register Your Business
        </button>
      );
      break;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Left image */}
        <div
          className={styles.cardImage}
          style={{ backgroundImage: "url('/pet-business.jpg')" }}
        ></div>

        {/* Right content */}
        <div className={styles.cardContent}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
          {btn && <div className={styles.btnWrapper}>{btn}</div>}
        </div>
      </div>
    </div>
  );
}
