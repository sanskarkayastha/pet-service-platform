"use client";

import { useState } from "react";
import styles from "./workingHours.module.css";
import Modal from "./Modal";

export default function WorkingHours() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>Working Hours</h3>
        <button onClick={() => setOpen(true)}>Edit</button>
      </div>

      <ul className={styles.list}>
        <li>
          <span>Mon - Fri</span>
          <span>09:00 AM – 06:00 PM</span>
        </li>
        <li>
          <span>Saturday</span>
          <span>10:00 AM – 04:00 PM</span>
        </li>
        <li>
          <span>Sunday</span>
          <span>Closed</span>
        </li>
      </ul>

      {open && (
        <Modal title="Edit Working Hours" onClose={() => setOpen(false)}>
          <p>Form logic goes here</p>
        </Modal>
      )}
    </div>
  );
}
