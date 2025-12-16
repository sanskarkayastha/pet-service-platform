
// "use client";
// import React, { useEffect, useMemo, useState } from "react";
// import styles from "../services.module.css";
// import { CheckCircle2, X, Clock } from "lucide-react";
// import BookingSummary from "../components/BookingSummary";
// import ServiceTabs, { ServiceTab } from "../components/ServiceTabs";

// /* ================= TYPES ================= */

// export type Addon = {
//   id: number;
//   name: string;
//   description?: string;
//   price: number;
// };

// export type Service = {
//   id: number;
//   category: "grooming" | "vet" | "boarding";
//   title: string;
//   duration: string;
//   description: string;
//   price: number;
//   addons?: Addon[];
// };

// type BookingItem = {
//   service: Service;
//   addons: Addon[];
//   qty?: number;
// };

// /* ================= STATIC DATA ================= */

// const SERVICES: Service[] = [
//   {
//     id: 1,
//     category: "grooming",
//     title: "Full Grooming Package",
//     duration: "2-3 hours",
//     description: "Complete grooming service including bath, haircut, nail trim, and ear cleaning.",
//     price: 75,
//     addons: [
//       { id: 11, name: "Paw Balm Treatment", price: 10 },
//       { id: 12, name: "Flea Treatment", price: 20 },
//       { id: 13, name: "Teeth Brushing", price: 15 }
//     ]
//   },
//   {
//     id: 10,
//     category: "vet",
//     title: "Vaccination Consultation",
//     duration: "30 mins",
//     description: "Routine vaccination check.",
//     price: 40
//   },
//   {
//     id: 20,
//     category: "boarding",
//     title: "Overnight Boarding",
//     duration: "24 hours",
//     description: "Safe and comfortable pet hostel.",
//     price: 35
//   }
// ];

// /* ================= TABS CONFIG ================= */

// const AVAILABLE_TABS: ServiceTab[] = [
//   { key: "grooming", label: "Pet Grooming" },
//   { key: "vet", label: "Veterinary Care" },
//   { key: "boarding", label: "Pet Hostel" }
// ];

// /* ================= MAIN COMPONENT ================= */

// export default function Services() {
//   const [activeCategory, setActiveCategory] =
//     useState<ServiceTab["key"]>(AVAILABLE_TABS[0].key);

//   const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
//   const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
//   const [modalService, setModalService] = useState<Service | null>(null);

//   const services = useMemo(
//     () => SERVICES.filter((s) => s.category === activeCategory),
//     [activeCategory]
//   );

//   const toggleServiceSelect = (service: Service) => {
//     const exists = selectedServiceIds.includes(service.id);

//     if (exists) {
//       setSelectedServiceIds((ids) => ids.filter((id) => id !== service.id));
//       setBookingItems((items) =>
//         items.filter((it) => it.service.id !== service.id)
//       );
//     } else {
//       setSelectedServiceIds((ids) => [...ids, service.id]);
//       setBookingItems((items) => [...items, { service, addons: [], qty: 1 }]);
//     }
//   };

//   const addToBookingFromModal = (
//     service: Service,
//     selectedAddonIds: number[]
//   ) => {
//     const addons =
//       service.addons?.filter((a) => selectedAddonIds.includes(a.id)) || [];

//     setBookingItems((items) => {
//       const rest = items.filter((it) => it.service.id !== service.id);
//       return [...rest, { service, addons, qty: 1 }];
//     });

//     if (!selectedServiceIds.includes(service.id)) {
//       setSelectedServiceIds((ids) => [...ids, service.id]);
//     }

//     setModalService(null);
//   };

//   return (
//     <div className={styles.pageWrap}>
//       <div className={styles.content}>
//         <div className={styles.left}>
//           {/* ✅ TABS */}
//           <ServiceTabs
//             tabs={AVAILABLE_TABS}
//             activeKey={activeCategory}
//             onChange={setActiveCategory}
//           />

//           {/* ✅ SERVICES */}
//           {services.map((svc) => {
//             const isSelected = selectedServiceIds.includes(svc.id);

//             return (
//               <div key={svc.id} className={styles.serviceCard}>
//                 <div className={styles.cardTop}>
//                   <div>
//                     <h3 className={styles.title}>{svc.title}</h3>
//                     <div className={styles.meta}>
//                       <Clock size={14} />
//                       <span>{svc.duration}</span>
//                     </div>
//                   </div>

//                   <div className={styles.controls}>
//                     <label className={styles.checkboxWrap}>
//                       <input
//                         type="checkbox"
//                         checked={isSelected}
//                         onChange={() => toggleServiceSelect(svc)}
//                       />
//                       <span className={styles.checkboxCustom}>
//                         {isSelected && <CheckCircle2 size={16} />}
//                       </span>
//                     </label>

//                     <button
//                       className={styles.detailsBtn}
//                       onClick={() => setModalService(svc)}
//                     >
//                       Details
//                     </button>
//                   </div>
//                 </div>

//                 <p className={styles.description}>{svc.description}</p>
//                 <div className={styles.price}>${svc.price.toFixed(2)}</div>
//               </div>
//             );
//           })}
//         </div>

//         <div className={styles.right}>
//           <BookingSummary
//             items={bookingItems}
//             onRemove={(id) =>
//               setBookingItems((items) =>
//                 items.filter((it) => it.service.id !== id)
//               )
//             }
//             onQtyChange={(id, qty) =>
//               setBookingItems((items) =>
//                 items.map((it) =>
//                   it.service.id === id ? { ...it, qty } : it
//                 )
//               )
//             }
//           />
//         </div>
//       </div>

//       {/* ✅ MODAL */}
//       {modalService && (
//         <ModalOverlay
//           service={modalService}
//           existingBooking={bookingItems.find(
//             (it) => it.service.id === modalService.id
//           )}
//           onClose={() => setModalService(null)}
//           onAddToBooking={addToBookingFromModal}
//         />
//       )}
//     </div>
//   );
// }

// /* ================= MODAL ================= */

// function ModalOverlay({
//   service,
//   existingBooking,
//   onClose,
//   onAddToBooking
// }: {
//   service: Service;
//   existingBooking?: BookingItem;
//   onClose: () => void;
//   onAddToBooking: (service: Service, selectedAddonIds: number[]) => void;
// }) {
//   const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>(
//     existingBooking?.addons.map((a) => a.id) || []
//   );

//   useEffect(() => {
//     const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
//     window.addEventListener("keydown", esc);
//     return () => window.removeEventListener("keydown", esc);
//   }, [onClose]);

//   return (
//     <div className={styles.modalOverlay} onClick={onClose}>
//       <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//         <h2>{service.title}</h2>

//         {service.addons?.map((a) => (
//           <label key={a.id} className={styles.addonItem}>
//             <input
//               type="checkbox"
//               checked={selectedAddonIds.includes(a.id)}
//               onChange={() =>
//                 setSelectedAddonIds((ids) =>
//                   ids.includes(a.id)
//                     ? ids.filter((x) => x !== a.id)
//                     : [...ids, a.id]
//                 )
//               }
//             />
//             {a.name} (+${a.price})
//           </label>
//         ))}

//         <button
//           className={styles.addBookingBtn}
//           onClick={() => onAddToBooking(service, selectedAddonIds)}
//         >
//           Add to Booking
//         </button>
//       </div>
//     </div>
//   );
// }

// ============================================
// FILE: Services.tsx
// ============================================
"use client";
import React, { useState, useMemo } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import styles from "../services.module.css";
import ServiceTabs, { ServiceTab } from "../components/ServiceTabs";
import ServiceDetailsModal, { Service, Addon } from "../components/ServiceDetailsModal";
import BookingSummary from "../components/BookingSummary";

type BookingItem = {
  service: Service;
  addons: Addon[];
  qty: number;
};

// Static Data
const SERVICES: Service[] = [
  {
    id: 1,
    category: "grooming",
    title: "Full Grooming Package",
    duration: "2-3 hours",
    description: "Our comprehensive grooming package includes a luxurious bath with premium shampoo and conditioner, professional haircut styled to your preference, nail trimming and filing, ear cleaning, teeth brushing, and a finishing spritz of pet-safe cologne. Your pet will leave looking and feeling their absolute best.",
    price: 7500,
    addons: [
      { id: 11, name: "Paw Balm Treatment", price: 1000, description: "Moisturizing paw care" },
      { id: 12, name: "Flea Treatment", price: 2000, description: "Anti-flea shampoo and treatment" },
      { id: 13, name: "Teeth Brushing", price: 1500, description: "Professional dental cleaning" },
      { id: 14, name: "De-shedding Treatment", price: 2500, description: "Reduce shedding by up to 80%" }
    ]
  },
  {
    id: 2,
    category: "grooming",
    title: "Bath & Brush",
    duration: "1 hour",
    description: "Relaxing bath with premium products and thorough brushing.",
    price: 4500
  },
  {
    id: 3,
    category: "grooming",
    title: "Puppy's First Grooming",
    duration: "1.5 hours",
    description: "Gentle introduction to grooming for puppies under 6 months.",
    price: 5000,
    addons: [{ id: 31, name: "Comfort Toy", price: 1500, description: "Comfort toy for puppies" }]
  },
  {
    id: 4,
    category: "grooming",
    title: "Express Nail Trim",
    duration: "15 mins",
    description: "Quick and professional nail trimming service.",
    price: 1500
  },
  {
    id: 10,
    category: "vet",
    title: "Vaccination Consultation",
    duration: "30 mins",
    description: "Routine vaccination check and admin.",
    price: 4000
  },
  {
    id: 11,
    category: "vet",
    title: "Wellness Check-up",
    duration: "45 mins",
    description: "Comprehensive health check for your pet.",
    price: 6000
  },
  {
    id: 20,
    category: "boarding",
    title: "Overnight Boarding",
    duration: "24 hours",
    description: "Safe and comfortable overnight boarding for pets.",
    price: 3500
  }
];

const AVAILABLE_TABS: ServiceTab[] = [
  { key: "grooming", label: "Pet Grooming" },
  { key: "vet", label: "Veterinary Care" },
  { key: "boarding", label: "Pet Hostel" }
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState<string>(AVAILABLE_TABS[0].key);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState<Service | null>(null);

  const services = useMemo(
    () => SERVICES.filter((s) => s.category === activeCategory),
    [activeCategory]
  );

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

  const openModal = (service: Service) => {
    setModalService(service);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalService(null);
  };

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
    setBookingItems((items) =>
      items.map((it) => (it.service.id === serviceId ? { ...it, qty: Math.max(1, qty) } : it))
    );
  };

  return (
    <div className={styles.pageWrap}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Left Column - Services */}
          <div className={styles.leftColumn}>
            <ServiceTabs
              tabs={AVAILABLE_TABS}
              activeKey={activeCategory}
              onChange={setActiveCategory}
            />

            <div className={styles.servicesList}>
              {services.map((svc) => {
                const isSelected = selectedServiceIds.includes(svc.id);
                return (
                  <div key={svc.id} className={styles.serviceCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardInfo}>
                        <h3 className={styles.serviceTitle}>{svc.title}</h3>
                        <div className={styles.serviceMeta}>
                          <Clock size={14} />
                          <span>{svc.duration}</span>
                        </div>
                      </div>
                      <div className={styles.cardControls}>
                        {/* <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleServiceSelect(svc)}
                            className={styles.checkbox}
                          />
                          {isSelected && (
                            <CheckCircle2 size={20} className={styles.checkIcon} />
                          )}
                        </label> */}
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleServiceSelect(svc)}
                            className={styles.checkbox}
                          />
                        </label>

                        <button onClick={() => openModal(svc)} className={styles.detailsBtn}>
                          Details
                        </button>
                      </div>
                    </div>
                    <p className={styles.serviceDescription}>{svc.description}</p>
                    <div className={styles.servicePrice}>Rs {svc.price}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className={styles.rightColumn}>
            <BookingSummary
              items={bookingItems}
              onRemove={removeFromBooking}
              onQtyChange={updateQty}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && modalService && (
        <ServiceDetailsModal
          service={modalService}
          onClose={closeModal}
          onAddToBooking={addToBookingFromModal}
          existingBooking={bookingItems.find((it) => it.service.id === modalService.id)}
        />
      )}
    </div>
  );
}
