"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Save } from "lucide-react";
import styles from "../page.module.css";
import apiClient from "@/lib/api-client";

interface BusinessInfo {
  id: number;
  businessName: string;
  ownerName: string;
  email: string;
  contactNumber: string;
  businessAddress: string;
  description: string;
  city: string;
  panNumber: string;
}

export default function BusinessSettingsPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [formData, setFormData] = useState<BusinessInfo>({
    id: 0,
    businessName: "",
    ownerName: "",
    email: "",
    contactNumber: "",
    businessAddress: "",
    description: "",
    city: "",
    panNumber: "",
  });

  useEffect(() => {
    loadBusinessInfo();
  }, []);

  const loadBusinessInfo = async () => {
    try {
      const response = await apiClient.get("/api/business/management/my-business");
      const data = response.data;
      setBusiness(data);
      setFormData({
        id: data.id,
        businessName: data.businessName || "",
        ownerName: data.ownerName || "",
        email: data.email || "",
        contactNumber: data.contactNumber || "",
        businessAddress: data.businessAddress || "",
        description: data.description || "",
        city: data.city || "",
        panNumber: data.panNumber || "",
      });
    } catch (error) {
      console.error("Failed to load business info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof BusinessInfo, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put("/api/business/management/update", {
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        contactNumber: formData.contactNumber,
        businessAddress: formData.businessAddress,
        description: formData.description,
        city: formData.city,
        panNumber: formData.panNumber,
      });
      alert("Business information updated successfully!");
      loadBusinessInfo();
    } catch (error: any) {
      console.error("Failed to update business:", error);
      alert("Failed to update business information");
    } finally {
      setSaving(false);
    }
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
          <h1>Business Settings</h1>
          <p>Update your business information</p>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className={styles.bookingsSection}>
        <h4 style={{ marginBottom: "20px", color: "#666" }}>BASIC INFORMATION</h4>

        <div style={{ display: "grid", gap: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "14px" }}>
              Business Name
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "14px" }}>
              Owner Name
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => handleChange("ownerName", e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "14px" }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "14px" }}>
                Contact Number
              </label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => handleChange("contactNumber", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "14px" }}>
              Business Address
            </label>
            <input
              type="text"
              value={formData.businessAddress}
              onChange={(e) => handleChange("businessAddress", e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "14px" }}>
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "14px" }}>
                PAN Number
              </label>
              <input
                type="text"
                value={formData.panNumber}
                onChange={(e) => handleChange("panNumber", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "14px" }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
                resize: "vertical",
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
