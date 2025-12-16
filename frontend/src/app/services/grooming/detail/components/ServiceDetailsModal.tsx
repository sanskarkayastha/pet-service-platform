// ============================================
// FILE: ServiceDetailsModal.tsx
// ============================================
"use client";
import React, { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import styles from "./serviceDetailsModal.module.css";

export type Addon = {
  id: number;
  name: string;
  description?: string;
  price: number;
};

export type Service = {
  id: number;
  category: "grooming" | "vet" | "boarding";
  title: string;
  duration: string;
  description: string;
  price: number;
  addons?: Addon[];
};

type BookingItem = {
  service: Service;
  addons: Addon[];
  qty: number;
};

type ServiceDetailsModalProps = {
  service: Service;
  onClose: () => void;
  onAddToBooking: (service: Service, selectedAddonIds: number[]) => void;
  existingBooking?: BookingItem;
};

export default function ServiceDetailsModal({
  service,
  onClose,
  onAddToBooking,
  existingBooking
}: ServiceDetailsModalProps) {
  const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>(
    existingBooking?.addons?.map((a) => a.id) || []
  );

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const toggleAddon = (id: number) => {
    setSelectedAddonIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  };

  const addonsTotal = (service.addons || [])
    .filter((a) => selectedAddonIds.includes(a.id))
    .reduce((s, a) => s + a.price, 0);

  const totalPrice = service.price + addonsTotal;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.iconCircle}>
              <Clock size={24} />
            </div>
            <div className={styles.headerInfo}>
              <h2 className={styles.modalTitle}>{service.title}</h2>
              <div className={styles.modalMeta}>
                <Clock size={14} />
                <span>{service.duration}</span>
                <span className={styles.metaDivider}>|</span>
                <span className={styles.modalPrice}>Rs{service.price}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className={styles.modalContent}>
          {/* Description */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>DESCRIPTION</h3>
            <p className={styles.description}>{service.description}</p>
          </div>

          {/* Add-ons */}
          {service.addons && service.addons.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>ENHANCE YOUR SERVICE</h3>
              <div className={styles.addonsList}>
                {service.addons.map((addon) => {
                  const checked = selectedAddonIds.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={`${styles.addonItem} ${checked ? styles.checked : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddon(addon.id)}
                        className={styles.addonCheckbox}
                      />
                      <div className={styles.addonContent}>
                        <div className={styles.addonName}>{addon.name}</div>
                        {addon.description && (
                          <div className={styles.addonDesc}>{addon.description}</div>
                        )}
                      </div>
                      <div className={styles.addonPrice}>+ Rs {addon.price}</div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className={styles.modalFooter}>
          <div className={styles.totalSection}>
            <div className={styles.totalLabel}>Total:</div>
            <div className={styles.totalPrice}>Rs {totalPrice}</div>
          </div>
          <button
            onClick={() => onAddToBooking(service, selectedAddonIds)}
            className={styles.addBtn}
          >
            Add to Booking
          </button>
        </div>
      </div>
    </div>
  );
}
