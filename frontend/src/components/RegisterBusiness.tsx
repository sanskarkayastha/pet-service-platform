"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./RegisterBusiness.module.css";
import Image from "next/image";
import img from "@/image/RegisterBusiness.png";

type BusinessStatusType = "NOT_APPLIED" | "PENDING" | "APPROVED";

interface BusinessStatusResponse {
  status: BusinessStatusType;
}

export default function RegisterBusiness( session: any) {
  const [status, setStatus] = useState<BusinessStatusType | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(session)
  const userId = session?.session?.session?.userId; 

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get<BusinessStatusResponse>(
          `http://localhost:8080/api/business/getBusinessStatus/${userId}`
        );

        setStatus(res.data.status);
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            // User has NOT registered a business yet
            setStatus("NOT_APPLIED");
          } else {
            setStatus("NOT_APPLIED"); // safe fallback
          }
        } else {
          console.error("Unknown error:", error);
          setStatus("NOT_APPLIED");
        }
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
      description ="Got a pet care service? We’d love to have you in our Furrever family! Join our platform to connect with pet parents, grow your business, and be part of a trusted community made just for animal lovers.";

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
      title = "Your Business is Under Review";
      description ="We’re excited to have you join our Furrever family! Our team is carefully reviewing your business details right now. Sit tight — once approved, you’ll be able to access your dashboard and start growing with us.";
      btn = null; // No button while pending
      break;

    case "APPROVED":
      title = "Let’s Get Started!";
      description ="Your account is ready. Head to your dashboard, showcase your services, and start reaching more pet parents today.";

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
      description = "Got a pet care service? We’d love to have you in our Furrever family! Join our platform to connect with pet parents, grow your business, and be part of a trusted community made just for animal lovers.";

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
        <div className={styles.cardImage}>
            <Image
                src={img}
                alt="Pet Business"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                style={{ objectFit: "contain" }}
                priority
            />
        </div>

        {/* Right content */}
        <div className={styles.cardContent}>
          <h2 className={styles.title}>{title}</h2>
          <br></br>
          <p className={styles.description}>{description}</p>
          <br></br>
          {btn && <div className={styles.btnWrapper}>{btn}</div>}
        </div>
      </div>
    </div>
  );
}
