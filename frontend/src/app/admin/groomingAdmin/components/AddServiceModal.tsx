'use client';

import styles from './addServiceModal.module.css';
import { X, Plus, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddServiceModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2>Add New Service</h2>
            <p>This service will be visible to customers during booking</p>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <h4>BASIC SERVICE INFORMATION</h4>

          <label>Service Title</label>
          <input placeholder="e.g., Full Grooming Package" />

          <label>Short Description</label>
          <input placeholder="One-line summary for service cards" />
          <small>Used in service list cards</small>

          <label>Detailed Description</label>
          <textarea placeholder="Detailed description for the service detail modal..." />
          <small>Shown in service detail modal</small>

          <h4>TIME & PRICING</h4>

          <div className={styles.row}>
            <div>
              <label>Estimated Duration</label>
              <input placeholder="e.g., 2-3 hours" />
            </div>
            <div>
              <label>Base Price</label>
              <input placeholder="Rs 0" />
            </div>
          </div>

          <h4>ENHANCE THIS SERVICE (ADD-ONS)</h4>
          <p className={styles.subText}>
            Optional services customers can add during booking
          </p>

          {/* Add-ons */}
          <div className={styles.addOn}>
            <input placeholder="De-shedding Treatment" />
            <input placeholder="Reduces shedding by" />
            <input placeholder="Rs 500" />
            <Trash2 size={18} />
          </div>

          <div className={styles.addOn}>
            <input placeholder="Teeth Cleaning" />
            <input placeholder="Professional dental hygiene" />
            <input placeholder="Rs 350" />
            <Trash2 size={18} />
          </div>

          <button className={styles.addBtn}>
            <Plus size={16} /> Add
          </button>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveBtn}>Save Service</button>
        </div>
      </div>
    </div>
  );
}
