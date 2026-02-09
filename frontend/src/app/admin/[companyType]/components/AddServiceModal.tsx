"use client";

import { CompanyType } from "../config";
import styles from "./addServiceModal.module.css";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyType: CompanyType;
}

export default function AddServiceModal({
  isOpen,
  onClose,
  companyType,
}: AddServiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Add Service ({companyType})</h2>

        <p>This modal will handle adding new services.</p>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
