"use client";
import { useEffect, useMemo, useState } from "react";
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

type ServiceCategory = "grooming" | "vet" | "boarding";

const BASE_TABS: ServiceTab[] = [
  { key: "grooming", label: "Pet Grooming" },
  { key: "vet", label: "Veterinary Care" },
  { key: "boarding", label: "Pet Hostel" }
];

export default function Services({ userId, businessId }: { userId?: string; businessId?: string }) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("grooming");
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [bookingItems, setBookingItems] = useState<BookingItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState<Service | null>(null);
  const [realServices, setRealServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only load services if we have either userId or businessId
    if (userId || businessId) {
      loadRealServices();
    }
  }, [userId, businessId]);

  const loadRealServices = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      let bizId: number;
      
      if (businessId) {
        // If businessId is provided, use it directly
        bizId = Number(businessId);
      } else if (userId) {
        // Otherwise, fetch business by userId
        const businessRes = await fetch(`${baseUrl}/api/business/by-user/${userId}`);
        if (!businessRes.ok) {
          throw new Error("Failed to fetch business");
        }
        const business = await businessRes.json();
        bizId = business.id;
      } else {
        // Neither businessId nor userId is available
        console.error("No businessId or userId provided");
        return;
      }

      // Fetch services for the business
      const servicesRes = await fetch(`${baseUrl}/api/services/business/${bizId}`);
      if (!servicesRes.ok) {
        throw new Error("Failed to fetch services");
      }
      const servicesData = await servicesRes.json();
      
      // Map to Service format
      const mapCategory = (c: string): ServiceCategory => {
        const lower = (c || "").toLowerCase();
        if (lower === "veterinary") return "vet";
        if (lower === "boarding") return "boarding";
        return "grooming";
      };
      
      const mapped: Service[] = servicesData.map((s: any) => ({
        id: s.id,
        category: mapCategory(s.category),
        title: s.title,
        duration: `${s.durationMinutes} mins`,
        description: s.description,
        price: s.price,
        addons: s.addons?.map((a: any) => ({
          id: a.id,
          name: a.name,
          description: a.description,
          price: a.price,
        })) || [],
      }));
      
      setRealServices(mapped);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  const services = useMemo(() => {
    return realServices.filter((s) => s.category === activeCategory);
  }, [activeCategory, realServices]);

  // Determine which tabs to show based on the actual
  // service types that this specific business offers.
  const availableCategories = useMemo(
    () => [...new Set(realServices.map((s) => s.category))],
    [realServices]
  );

  const tabs: ServiceTab[] =
    availableCategories.length > 0
      ? BASE_TABS.filter((tab) => availableCategories.includes(tab.key as ServiceCategory))
      : BASE_TABS;

  // Keep active category in sync with available tabs
  useEffect(() => {
    if (!tabs.some((t) => t.key === activeCategory) && tabs.length > 0) {
      setActiveCategory(tabs[0].key as ServiceCategory);
    }
  }, [tabs, activeCategory]);

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

  const handleTabChange = (key: string) => {
    setActiveCategory(key as ServiceCategory);
  };

  if (loading) {
    return (
      <div className={styles.pageWrap}>
        <div className={styles.container}>
          <p>Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrap}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Left Column - Services */}
          <div className={styles.leftColumn}>
            <ServiceTabs
              tabs={tabs}
              activeKey={activeCategory}
              onChange={handleTabChange}
            />

            <div className={styles.servicesList}>
              {services.length === 0 && (
                <p className={styles.emptyState}>
                  No services are available in this category yet.
                </p>
              )}
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