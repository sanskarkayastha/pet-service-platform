"use client";

import React from "react";
import styles from "./../styles/Footer.module.css";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.footerTop}>
        <div className={styles.footerSection}>
          <h3>About Us</h3>
          <p>Care Made Simple, Love Made Furrever.</p>
          <p>
            We provide the best services for your pets: safe, loving, and
            reliable care for your furry friends while keeping them happy and
            healthy.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link href="/users">Home</Link>
            </li>
            <li>
              <Link href="/users#services">Services</Link>
            </li>
            <li>
              <Link href="/users/petServices/grooming">Grooming</Link>
            </li>
            <li>
              <Link href="/users#contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Contact</h3>
          <ul>
            <li>Email: info@furrEver.com</li>
            <li>Phone: +977 9765439870</li>
            <li>Address: Itachhen, Bhaktapur</li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        &copy; 2025 FurrEver. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
