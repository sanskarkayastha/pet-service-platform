"use client";

import { useState } from "react";
import styles from "./breakTime.module.css";
import Modal from "./Modal";

export default function BreakTime() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3>Break Time</h3>
        <button onClick={() => setOpen(true)}>Add Break</button>
      </div>

      <ul className={styles.list}>
        <li>01:00 PM – 02:00 PM</li>
        <li>04:30 PM – 05:00 PM</li>
      </ul>

      {open && (
        <Modal title="Add Break Time" onClose={() => setOpen(false)}>
          <p>Break time form goes here</p>
        </Modal>
      )}
    </div>
  );
}
