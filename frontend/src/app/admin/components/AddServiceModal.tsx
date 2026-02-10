"use client";

import { useState, useEffect } from "react";
import styles from "./addServiceModal.module.css";
import { X, Plus, Trash2 } from "lucide-react";
import apiClient from "@/lib/api-client";

interface AddOn {
  title: string;
  description: string;
  price: string;
}

interface ServiceForm {
  title: string;
  shortDescription: string;
  detailedDescription: string;
  duration: string;
  basePrice: string;
  addOns: AddOn[];
}

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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  editingService?: Service | null;
}

export default function AddServiceModal({
  isOpen,
  onClose,
  category,
  editingService,
}: Props) {
  const [form, setForm] = useState<ServiceForm>({
    title: editingService?.title || "",
    shortDescription: editingService?.description || "",
    detailedDescription: editingService?.description || "",
    duration: editingService?.durationMinutes?.toString() || "",
    basePrice: editingService?.price?.toString() || "",
    addOns:
      editingService?.addons?.map((a) => ({
        title: a.name,
        description: a.description,
        price: a.price.toString(),
      })) || [{ title: "", description: "", price: "" }],
  });

  useEffect(() => {
    if (editingService) {
      setForm({
        title: editingService.title,
        shortDescription: editingService.description,
        detailedDescription: editingService.description,
        duration: editingService.durationMinutes.toString(),
        basePrice: editingService.price.toString(),
        addOns:
          editingService.addons?.map((a) => ({
            title: a.name,
            description: a.description,
            price: a.price.toString(),
          })) || [{ title: "", description: "", price: "" }],
      });
    } else {
      setForm({
        title: "",
        shortDescription: "",
        detailedDescription: "",
        duration: "",
        basePrice: "",
        addOns: [{ title: "", description: "", price: "" }],
      });
    }
  }, [editingService, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof ServiceForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleAddOnChange = (
    index: number,
    field: keyof AddOn,
    value: string
  ) => {
    const updated = [...form.addOns];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, addOns: updated });
  };

  const addNewAddOn = () => {
    setForm({
      ...form,
      addOns: [...form.addOns, { title: "", description: "", price: "" }],
    });
  };

  const removeAddOn = (index: number) => {
    const updated = form.addOns.filter((_, i) => i !== index);
    setForm({ ...form, addOns: updated });
  };

  const handleSave = async () => {
    try {
      const cleanedAddOns = form.addOns.filter((a) => a.title.trim() !== "");

      const businessResponse = await apiClient.get(
        "/api/business/management/my-business"
      );
      const businessId = businessResponse.data.id;

      const payload = {
        businessId,
        category: category || "GROOMING",
        title: form.title,
        durationMinutes: parseInt(form.duration) || 60,
        description: form.detailedDescription || form.shortDescription,
        price: Number(form.basePrice),
        addons: cleanedAddOns.map((a) => ({
          name: a.title,
          description: a.description,
          price: Number(a.price),
        })),
      };

      if (editingService) {
        await apiClient.put(
          `/api/services/management/${editingService.id}`,
          payload
        );
      } else {
        await apiClient.post("/api/services/management/create", payload);
      }

      onClose();
    } catch (error: unknown) {
      console.error("Failed to save service:", error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      alert(
        "Failed to save service: " +
          (err.response?.data?.message || err.message || "Unknown error")
      );
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2>{editingService ? "Edit Service" : "Add New Service"}</h2>
            <p>This service will be visible to customers during booking</p>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          <h4>BASIC SERVICE INFORMATION</h4>

          <label>Service Title</label>
          <input
            placeholder="e.g., Full Grooming Package"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <label>Short Description</label>
          <input
            placeholder="One-line summary for service cards"
            value={form.shortDescription}
            onChange={(e) => handleChange("shortDescription", e.target.value)}
          />
          <small>Used in service list cards</small>

          <label>Detailed Description</label>
          <textarea
            placeholder="Detailed description..."
            value={form.detailedDescription}
            onChange={(e) =>
              handleChange("detailedDescription", e.target.value)
            }
          />
          <small>Shown in service detail modal</small>

          <h4>TIME & PRICING</h4>

          <div className={styles.row}>
            <div>
              <label>Estimated Duration (minutes)</label>
              <input
                placeholder="e.g., 60"
                value={form.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
              />
            </div>

            <div>
              <label>Base Price</label>
              <input
                placeholder="Rs 0"
                value={form.basePrice}
                onChange={(e) =>
                  handleChange("basePrice", e.target.value.replace(/\D/g, ""))
                }
              />
            </div>
          </div>

          <h4>ENHANCE THIS SERVICE (ADD-ONS)</h4>
          <p className={styles.subText}>
            Optional services customers can add during booking
          </p>

          {form.addOns.map((addOn, index) => (
            <div key={index} className={styles.addOn}>
              <input
                placeholder="Add-on title"
                value={addOn.title}
                onChange={(e) =>
                  handleAddOnChange(index, "title", e.target.value)
                }
              />
              <input
                placeholder="Short description"
                value={addOn.description}
                onChange={(e) =>
                  handleAddOnChange(index, "description", e.target.value)
                }
              />
              <input
                placeholder="Rs 0"
                value={addOn.price}
                onChange={(e) =>
                  handleAddOnChange(
                    index,
                    "price",
                    e.target.value.replace(/\D/g, "")
                  )
                }
              />
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => removeAddOn(index)}
                disabled={form.addOns.length === 1}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <button type="button" className={styles.addBtn} onClick={addNewAddOn}>
            <Plus size={16} /> Add Another Add-On
          </button>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={handleSave}>
            {editingService ? "Update Service" : "Save Service"}
          </button>
        </div>
      </div>
    </div>
  );
}
