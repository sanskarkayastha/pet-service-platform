"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Scissors, Hotel, Stethoscope } from "lucide-react";
import styles from "../page.module.css";
import AddServiceModal from "../components/AddServiceModal";
import apiClient from "@/lib/api-client";

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: typeof Scissors }
> = {
  GROOMING: { label: "Grooming", icon: Scissors },
  BOARDING: { label: "Pet Hostel", icon: Hotel },
  VETERINARY: { label: "Veterinary", icon: Stethoscope },
};

interface Service {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  price: number;
  category: string;
  addons: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
  }>;
}

export default function ServicesManagementPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setErrorMessage(null);
      const response = await apiClient.get("/api/services/management/my-services");
      setServices(response.data);
      if (!selectedCategory && response.data.length > 0) {
        const categories = [
          ...new Set(response.data.map((s: Service) => String(s.category))),
        ] as string[];
        setSelectedCategory(categories[0] ?? "GROOMING");
      } else if (!selectedCategory) {
        setSelectedCategory("GROOMING");
      }
    } catch (error) {
      const status = (error as any)?.response?.status;
      if (status === 403) {
        setErrorMessage(
          "You don't have permission to manage services. Please sign in with a business account."
        );
        console.warn("Access denied while loading services (403).");
      } else {
        console.error("Failed to load services:", error);
        setErrorMessage("Something went wrong while loading services.");
      }
      if (!selectedCategory) {
        setSelectedCategory("GROOMING");
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    ...new Set(services.map((s) => s.category)),
  ].filter(Boolean) as string[];

  // Only show service types that this business actually offers.
  // If there are no services yet, we keep the category bar empty
  // and show the "Add Service" call-to-action.
  const displayCategories = categories;
  const activeCategory = selectedCategory || displayCategories[0];

  const filteredServices = activeCategory
    ? services.filter((s) => s.category === activeCategory)
    : services;

  const handleDelete = async (serviceId: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await apiClient.delete(`/api/services/management/${serviceId}`);
      loadServices();
    } catch (error) {
      console.error("Failed to delete service:", error);
      alert("Failed to delete service");
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setOpen(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingService(null);
    loadServices();
  };

  if (loading) {
    return (
      <main className={styles.mainContent}>
        <p>Loading...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className={styles.mainContent}>
        <div
          style={{
            maxWidth: "480px",
            margin: "80px auto",
            padding: "24px",
            borderRadius: "12px",
            background: "#fff3e0",
            border: "1px solid #ffe0b2",
            color: "#6d4c41",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginBottom: "8px", fontSize: "22px" }}>Access restricted</h1>
          <p style={{ marginBottom: 0 }}>{errorMessage}</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainContent}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h1>Services Management</h1>
          <p>Manage your services by category</p>
        </div>
        <button className={styles.btnPrimary} onClick={handleAddNew}>
          <Plus size={18} />
          Add Service
        </button>
      </div>

      {/* Category bar - only shows categories for this business */}
      {displayCategories.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "24px",
            padding: "12px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            flexWrap: "wrap",
          }}
        >
          {displayCategories.map((cat) => {
            const config = CATEGORY_CONFIG[cat] || {
              label: cat,
              icon: Scissors,
            };
            const Icon = config.icon;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  border: `2px solid ${isActive ? "#9c27b0" : "#e0e0e0"}`,
                  borderRadius: "10px",
                  background: isActive ? "#f3e5f5" : "white",
                  color: isActive ? "#7b1fa2" : "#666",
                  cursor: "pointer",
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                <Icon size={18} />
                {config.label}
              </button>
            );
          })}
        </div>
      )}

      <AddServiceModal
        isOpen={open}
        onClose={handleClose}
        category={activeCategory}
        editingService={editingService}
      />

      <div className={styles.bookingsSection}>
        <div className={styles.sectionHeader}>
          <h2>
            {CATEGORY_CONFIG[activeCategory]?.label || activeCategory} Services
          </h2>
        </div>
        <p className={styles.totalCount}>
          {filteredServices.length} service
          {filteredServices.length !== 1 ? "s" : ""} in this category
        </p>

        {filteredServices.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>
            No services in this category yet. Click &quot;Add Service&quot; to
            create one.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {filteredServices.map((service) => (
              <div key={service.id} className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                  <div className={styles.bookingId}>
                    <span>{service.title}</span>
                    <span className={styles.statusBadge}>{service.category}</span>
                  </div>
                  <div className={styles.bookingPrice}>Rs {service.price}</div>
                </div>

                <div className={styles.bookingDetails}>
                  <div className={styles.detailItem}>
                    <h4>DESCRIPTION</h4>
                    <p>{service.description}</p>
                  </div>
                  <div className={styles.detailItem}>
                    <h4>DURATION</h4>
                    <p>{service.durationMinutes} minutes</p>
                  </div>
                  <div className={styles.detailItem}>
                    <h4>ADD-ONS</h4>
                    <p>{service.addons?.length || 0} available</p>
                  </div>
                </div>

                <div className={styles.bookingActions}>
                  <button
                    className={`${styles.btnAction} ${styles.btnView}`}
                    onClick={() => handleEdit(service)}
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    className={`${styles.btnAction} ${styles.btnCancel}`}
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
