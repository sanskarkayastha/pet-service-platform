"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Plus, Edit, Trash2 } from "lucide-react";
import styles from "../page.module.css";
import AddServiceModal from "../components/AddServiceModal";
import apiClient from "@/lib/api-client";

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
  const params = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await apiClient.get("/api/services/management/my-services");
      setServices(response.data);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <main className={styles.mainContent}>
      <div className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h1>Services Management</h1>
          <p>Manage your services that customers can book</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setOpen(true)}>
          <Plus size={18} />
          Add Service
        </button>
      </div>

      <AddServiceModal
        isOpen={open}
        onClose={handleClose}
        companyType={params.companyType as string}
        editingService={editingService}
      />

      <div className={styles.bookingsSection}>
        <div className={styles.sectionHeader}>
          <h2>All Services</h2>
        </div>
        <p className={styles.totalCount}>{services.length} total services</p>

        {services.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>
            No services yet. Click "Add Service" to create your first service.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {services.map((service) => (
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
