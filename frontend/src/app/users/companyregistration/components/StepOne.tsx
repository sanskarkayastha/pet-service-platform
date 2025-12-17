import React, { useState } from 'react';
import { Building2, User, Mail, Phone, MapPin, FileText, ArrowRight } from 'lucide-react';
import styles from '../components/Registration.module.css';

interface StepOneProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ formData, setFormData, onNext }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName?.trim()) newErrors.businessName = "Business name is required";
    if (!formData.ownerName?.trim()) newErrors.ownerName = "Owner name is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (!formData.contactNumber?.trim()) newErrors.contactNumber = "Contact number is required";
    if (!formData.businessAddress?.trim()) newErrors.businessAddress = "Address is required";
    if (!formData.serviceType?.trim()) newErrors.serviceType = "Service type is required";
    if (!formData.businessDescription?.trim())
      newErrors.businessDescription = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    onNext();
  };

  return (
    <div>
      <h2 className={styles.sectionTitle}>Basic Information</h2>
      <p className={styles.sectionSubtitle}>Tell us about your pet service business</p>

      <div className={styles.formGrid}>
        {/* Business Name */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <Building2 size={14} color="#FF6B35" />
            Business Name <span className={styles.required}>*</span>
          </label>
          <input
            className={`${styles.input} ${errors.businessName ? styles.inputError : ""}`}
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
          />
          {errors.businessName && <p className={styles.errorText}>{errors.businessName}</p>}
        </div>

        {/* Owner Name */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <User size={14} color="#FF6B35" />
            Owner Full Name <span className={styles.required}>*</span>
          </label>
          <input
            className={`${styles.input} ${errors.ownerName ? styles.inputError : ""}`}
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          />
          {errors.ownerName && <p className={styles.errorText}>{errors.ownerName}</p>}
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <Mail size={14} color="#FF6B35" />
            Email Address <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
        </div>

        {/* Contact */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <Phone size={14} color="#FF6B35" />
            Contact Number <span className={styles.required}>*</span>
          </label>
          <input
            className={`${styles.input} ${errors.contactNumber ? styles.inputError : ""}`}
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
          />
          {errors.contactNumber && <p className={styles.errorText}>{errors.contactNumber}</p>}
        </div>

        {/* Address */}
        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
          <label className={styles.label}>
            <MapPin size={14} color="#FF6B35" />
            Business Address <span className={styles.required}>*</span>
          </label>
          <input
            className={`${styles.input} ${errors.businessAddress ? styles.inputError : ""}`}
            value={formData.businessAddress}
            onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
          />
          {errors.businessAddress && (
            <p className={styles.errorText}>{errors.businessAddress}</p>
          )}
        </div>

        {/* Service Type */}
        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
          <label className={styles.label}>
            <Building2 size={14} color="#FF6B35" />
            Service Type <span className={styles.required}>*</span>
          </label>
          <select
            className={`${styles.select} ${errors.serviceType ? styles.inputError : ""}`}
            value={formData.serviceType}
            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
          >
            <option value="">Select service</option>
            <option value="GROOMING">Pet Grooming</option>
            <option value="BOARDING">Pet Boarding</option>
            <option value="VETERINARY">Veterinary</option>
          </select>
          {errors.serviceType && <p className={styles.errorText}>{errors.serviceType}</p>}
        </div>

        {/* Description */}
        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
          <label className={styles.label}>
            <FileText size={14} color="#FF6B35" />
            Business Description <span className={styles.required}>*</span>
          </label>
          <textarea
            className={`${styles.textarea} ${errors.businessDescription ? styles.inputError : ""}`}
            value={formData.businessDescription}
            onChange={(e) =>
              setFormData({ ...formData, businessDescription: e.target.value })
            }
          />
          {errors.businessDescription && (
            <p className={styles.errorText}>{errors.businessDescription}</p>
          )}
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleContinue}
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default StepOne;
