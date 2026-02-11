import styles from "./ContactFurrever.module.css";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactFurrever() {
  return (
    <div className={styles.page}>
      <div className={styles.circleTopLeft}></div>
      <div className={styles.circleBottomLeft}></div>

      <div className={styles.container}>
        {/* LEFT SIDE — FORM */}
        <div className={styles.contactSection}>
          <h1>Contact Furrever</h1>
          <p className={styles.subtitle}>
            Have questions about grooming, vet bookings, or pet boarding? Our team
            is here to help you and your furry friends 🐾
          </p>

          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input type="text" />
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" />
            </div>

            <div className={styles.formGroup}>
              <label>Message</label>
              <textarea />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Send Message
            </button>
          </form>
        </div>

        {/* RIGHT SIDE — INFO */}
        <div className={styles.infoCard}>
          <h2>Furrever Info</h2>

          <div className={styles.infoItem}>
            <Mail size={20} />
            <span>support@furrever.com</span>
          </div>

          <div className={styles.infoItem}>
            <Phone size={20} />
            <span>+977 9845673454</span>
          </div>

          <div className={styles.infoItem}>
            <MapPin size={20} />
            <span>Kathmandu, Nepal</span>
          </div>

          <div className={styles.infoItem}>
            <Clock size={20} />
            <span>09:00 AM – 06:00 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
