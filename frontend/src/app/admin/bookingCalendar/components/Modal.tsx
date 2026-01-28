"use client";

import styles from "./modal.module.css";
import { X } from "lucide-react";

interface Props {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ title, onClose, children }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h4>{title}</h4>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
