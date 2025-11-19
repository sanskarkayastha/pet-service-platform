
"use client";
import React, { useEffect, useMemo, useState } from "react";
import styles from "../services.module.css";
import bookingStyles from "../bookingSummary.module.css";
import {
  CheckCircle2,
  X,
  Clock,
  Plus,
  Minus,
  Trash2
} from "lucide-react";
import BookingSummary from "./BookingSummary";

/**
 * Types
 */
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
  qty?: number;
};

/**
 * Static data (example)
 */
const SERVICES: Service[] = [
  {
    id: 1,
    category: "grooming",
    title: "Full Grooming Package",
    duration: "2-3 hours",
    description:
      "Complete grooming service including bath, haircut, nail trim, and ear cleaning.",
    price: 75,
    addons: [
      { id: 11, name: "Paw Balm Treatment", price: 10, description: "Moisturizing paw care" },
      { id: 12, name: "Flea Treatment", price: 20, description: "Anti-flea shampoo and treatment" },
      { id: 13, name: "Teeth Brushing", price: 15, description: "Professional dental cleaning" },
      { id: 14, name: "De-shedding Treatment", price: 25, description: "Reduce shedding by up to 80%" }
    ]
  },
  {
    id: 2,
    category: "grooming",
    title: "Bath & Brush",
    duration: "1 hour",
    description: "Relaxing bath with premium products and thorough brushing.",
    price: 45
  },
  {
    id: 3,
    category: "grooming",
    title: "Puppy's First Grooming",
    duration: "1.5 hours",
    description: "Gentle introduction to grooming for puppies under 6 months.",
    price: 50,
    addons: [{ id: 31, name: "Comfort Toy", price: 15, description: "Comfort toy for puppies" }]
  },
  {
    id: 4,
    category: "grooming",
    title: "Express Nail Trim",
    duration: "15 mins",
    description: "Quick and professional nail trimming service.",
    price: 15
  },
  // vet
  {
    id: 10,
    category: "vet",
    title: "Vaccination Consultation",
    duration: "30 mins",
    description: "Routine vaccination check and admin.",
    price: 40
  },
  {
    id: 11,
    category: "vet",
    title: "Wellness Check-up",
    duration: "45 mins",
    description: "Comprehensive health check for your pet.",
    price: 60
  },
  // boarding
  {
    id: 20,
    category: "boarding",
    title: "Overnight Boarding",
    duration: "24 hours",
    description: "Safe and comfortable overnight boarding for pets.",
    price: 35
  }
];

/**
 * Categories for slider
 */
const CATEGORIES = [
  { key: "grooming", label: "Pet Grooming" },
  { key: "vet", label: "Veterinary Care" },
  { key: "boarding", label: "Pet Boarding" }
] as const;

/**
 * Services component (contains modal)
 */
export default function Services() {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]["key"]>("grooming");
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState<Service | null>(null);

  const services = useMemo(() => SERVICES.filter((s) => s.category === activeCategory), [activeCategory]);

  // toggle service selection (checkbox-like behavior)
  const toggleServiceSelect = (service: Service) => {
    const exists = selectedServiceIds.includes(service.id);
    if (exists) {
      setSelectedServiceIds((ids) => ids.filter((id) => id !== service.id));
      setBookingItems((items) => items.filter((it) => it.service.id !== service.id));
    } else {
      setSelectedServiceIds((ids) => [...ids, service.id]);
      setBookingItems((items) => [...items, { service, addons: [], qty: 1 }]);
    }
  };

  // open modal to view details & choose add-ons (checkbox style)
  const openModal = (service: Service) => {
    setModalService(service);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalService(null);
  };

  // Receive selection from modal
  const addToBookingFromModal = (service: Service, selectedAddonIds: number[]) => {
    const addons = (service.addons || []).filter((a) => selectedAddonIds.includes(a.id));
    setBookingItems((items) => {
      const others = items.filter((it) => it.service.id !== service.id);
      return [...others, { service, addons, qty: 1 }];
    });
    if (!selectedServiceIds.includes(service.id)) {
      setSelectedServiceIds((ids) => [...ids, service.id]);
    }
    closeModal();
  };

  const removeFromBooking = (serviceId: number) => {
    setBookingItems((items) => items.filter((it) => it.service.id !== serviceId));
    setSelectedServiceIds((ids) => ids.filter((id) => id !== serviceId));
  };

  const updateQty = (serviceId: number, qty: number) => {
    setBookingItems((items) => items.map((it) => (it.service.id === serviceId ? { ...it, qty: Math.max(1, qty) } : it)));
  };

  return (
    <div className={styles.pageWrap}>
      <div className={styles.content}>
        <div className={styles.left}>
          {/* Slider-style category buttons */}
         <div className={styles.segmentWrapper}>
            <div className={styles.segmentTabs} role="tablist">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  className={`${styles.segmentBtn} ${
                    activeCategory === c.key ? styles.active : ""
                  }`}
                  onClick={() => setActiveCategory(c.key)}
                  aria-pressed={activeCategory === c.key}
                >
                  {c.label}
                </button>
              ))}

              <div
                className={styles.segmentIndicator}
                style={{
                  transform: `translateX(${
                    CATEGORIES.findIndex((c) => c.key === activeCategory) * 100
                  }%)`,
                }}
              />
            </div>
          </div>


          {/* Service list */}
          {services.map((svc) => {
            const isSelected = selectedServiceIds.includes(svc.id);
            return (
              <div key={svc.id} className={styles.serviceCard}>
                <div className={styles.cardTop}>
                  <div>
                    <h3 className={styles.title}>{svc.title}</h3>
                    <div className={styles.meta}>
                      <Clock size={14} style={{ marginRight: 6 }} />
                      <span className={styles.duration}>{svc.duration}</span>
                    </div>
                  </div>

                  <div className={styles.controls}>
                    <label className={styles.checkboxWrap}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleServiceSelect(svc)}
                        aria-label={`Select ${svc.title}`}
                      />
                      <span className={styles.checkboxCustom}>{isSelected && <CheckCircle2 size={16} />}</span>
                    </label>

                    <button className={styles.detailsBtn} onClick={() => openModal(svc)}>
                      Details
                    </button>
                  </div>
                </div>

                <p className={styles.description}>{svc.description}</p>

                <div className={styles.cardFooter}>
                  <div className={styles.price}>${svc.price.toFixed(2)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Booking summary - pass items and handlers */}
        <div className={styles.right}>
          <BookingSummary
            items={bookingItems}
            onRemove={removeFromBooking}
            onQtyChange={updateQty}
          />
        </div>
      </div>

      {/* Modal overlay */}
      {modalOpen && modalService && (
        <ModalOverlay
          service={modalService}
          onClose={closeModal}
          onAddToBooking={addToBookingFromModal}
          existingBooking={bookingItems.find((it) => it.service.id === modalService.id)}
        />
      )}
    </div>
  );
}

/**
 * ModalOverlay component (defined inside same file)
 */
function ModalOverlay({
  service,
  onClose,
  onAddToBooking,
  existingBooking
}: {
  service: Service;
  onClose: () => void;
  onAddToBooking: (service: Service, selectedAddonIds: number[]) => void;
  existingBooking?: BookingItem;
}) {
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
    setSelectedAddonIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  };

  const addonsTotal = (service.addons || []).filter((a) => selectedAddonIds.includes(a.id)).reduce((s, a) => s + a.price, 0);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{service.title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalMeta}>
          <div className={styles.modalDuration}><Clock size={14} style={{ marginRight: 6 }} />{service.duration}</div>
          <div className={styles.modalPrice}>${service.price.toFixed(2)}</div>
        </div>

        <h4 className={styles.sectionTitle}>Full Description</h4>
        <p className={styles.longDesc}>{service.description}</p>

        {service.addons && service.addons.length > 0 && (
          <>
            <h4 className={styles.sectionTitle}>Available Add-ons</h4>
            <div className={styles.addonsList}>
              {service.addons.map((a) => {
                const checked = selectedAddonIds.includes(a.id);
                return (
                  <label key={a.id} className={`${styles.addonItem} ${checked ? styles.checked : ""}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleAddon(a.id)} />
                    <div className={styles.addonContent}>
                      <div className={styles.addonTitle}>{a.name}</div>
                      {a.description && <div className={styles.addonDesc}>{a.description}</div>}
                    </div>
                    <div className={styles.addonPrice}>+ ${a.price.toFixed(2)}</div>
                  </label>
                );
              })}
            </div>
          </>
        )}

        <div className={styles.modalFooter}>
          <div className={styles.addonTotal}>Add-ons total: ${addonsTotal.toFixed(2)}</div>
          <button className={styles.addBookingBtn} onClick={() => onAddToBooking(service, selectedAddonIds)}>
            Add to Booking
          </button>
        </div>
      </div>
    </div>
  );
}