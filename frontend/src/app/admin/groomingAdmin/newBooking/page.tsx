'use client';

import { useState, useRef } from 'react';
import { Upload, X, Check, Scissors, Home, Stethoscope } from 'lucide-react';
import styles from './page.module.css';

interface FormData {
  companyName: string;
  companyAddress: string;
  selectedServices: string[];
  aboutUs: string;
  images: File[];
}

interface ImagePreview {
  file: File;
  preview: string;
}

const services = [
  { id: 'grooming', label: 'Pet Grooming', Icon: Scissors },
  { id: 'hostel', label: 'Pet Hostel', Icon: Home },
  { id: 'vet', label: 'Veterinary', Icon: Stethoscope },
];

export default function BookingForm() {
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    companyAddress: '',
    selectedServices: [],
    aboutUs: '',
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }));
    if (errors.selectedServices) {
      setErrors((prev) => ({
        ...prev,
        selectedServices: '',
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const currentCount = imagePreviews.length;
    const remainingSlots = 3 - currentCount;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = {
          file,
          preview: reader.result as string,
        };

        setImagePreviews((prev) => [...prev, preview]);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, file],
        }));

        if (errors.images) {
          setErrors((prev) => ({
            ...prev,
            images: '',
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    e.currentTarget.value = '';
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.companyAddress.trim()) {
      newErrors.companyAddress = 'Company address is required';
    }
    if (formData.selectedServices.length === 0) {
      newErrors.selectedServices = 'Please select at least one service';
    }
    if (!formData.aboutUs.trim()) {
      newErrors.aboutUs = 'About Us information is required';
    }
    if (imagePreviews.length === 0) {
      newErrors.images = 'Please upload at least one image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log('Form Data:', {
      ...formData,
      images: imagePreviews.map((img) => img.preview),
    });

    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        companyName: '',
        companyAddress: '',
        selectedServices: [],
        aboutUs: '',
        images: [],
      });
      setImagePreviews([]);
      setSubmitted(false);
    }, 2000);
  };

  const handleReset = () => {
    setFormData({
      companyName: '',
      companyAddress: '',
      selectedServices: [],
      aboutUs: '',
      images: [],
    });
    setImagePreviews([]);
    setErrors({});
  };

  if (submitted) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <Check size={64} />
          </div>
          <h2 className={styles.successTitle}>Booking Submitted Successfully!</h2>
          <p className={styles.successText}>Your company information has been registered. Our team will review and get back to you soon.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainContent}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>New Booking</h1>
          <p className={styles.formSubtitle}>Register your company and select services</p>
        </div>

        <div className={styles.form}>
          {/* Company Name */}
          <div className={styles.formGroup}>
            <label htmlFor="companyName" className={styles.label}>Company Name *</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Enter company name"
              className={styles.input}
            />
            {errors.companyName && (
              <span className={styles.error}>{errors.companyName}</span>
            )}
          </div>

          {/* Company Address */}
          <div className={styles.formGroup}>
            <label htmlFor="companyAddress" className={styles.label}>Company Address *</label>
            <input
              type="text"
              id="companyAddress"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleInputChange}
              placeholder="Enter company address"
              className={styles.input}
            />
            {errors.companyAddress && (
              <span className={styles.error}>{errors.companyAddress}</span>
            )}
          </div>

          {/* Image Upload */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Company Images (Upload up to 3 images) *</label>
            <div className={styles.uploadArea}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.fileInput}
              />
              <div
                className={`${styles.uploadBox} ${imagePreviews.length > 0 ? styles.uploadBoxWithImages : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add(styles.dragOver);
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove(styles.dragOver);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove(styles.dragOver);
                  handleImageUpload({
                    currentTarget: { files: e.dataTransfer.files, value: '' },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
              >
                {imagePreviews.length > 0 && (
                  <div className={styles.imageGridInside}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className={styles.imageCard}>
                        <img
                          src={preview.preview}
                          alt={`Preview ${index + 1}`}
                          className={styles.cardImage}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                          className={styles.removeBtn}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className={`${styles.uploadPrompt} ${imagePreviews.length === 3 ? styles.uploadPromptHidden : ''}`}>
                  <Upload size={32} className={styles.uploadIcon} />
                  <p className={styles.uploadText}>Click to upload or drag and drop</p>
                  <span className={styles.uploadSubtext}>PNG, JPG, GIF up to 10MB</span>
                </div>
                <div className={styles.imageCounter}>
                  {imagePreviews.length} / 3 images uploaded
                </div>
              </div>
            </div>

            {errors.images && (
              <span className={styles.error}>{errors.images}</span>
            )}
          </div>

          {/* Service Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Services *</label>
            <div className={styles.servicesGrid}>
              {services.map((service) => {
                const Icon = service.Icon;
                return (
                  <div
                    key={service.id}
                    onClick={() => handleServiceToggle(service.id)}
                    className={`${styles.serviceCard} ${
                      formData.selectedServices.includes(service.id)
                        ? styles.serviceCardSelected
                        : ''
                    }`}
                  >
                    <div className={styles.serviceIcon}>
                      <Icon size={40} color="#fbbf24" />
                    </div>
                    <p className={styles.serviceLabel}>{service.label}</p>
                    {formData.selectedServices.includes(service.id) && (
                      <div className={styles.checkmark}>
                        <Check size={20} color="white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {errors.selectedServices && (
              <span className={styles.error}>{errors.selectedServices}</span>
            )}
          </div>

          {/* About Us */}
          <div className={styles.formGroup}>
            <label htmlFor="aboutUs" className={styles.label}>About Us *</label>
            <textarea
              id="aboutUs"
              name="aboutUs"
              value={formData.aboutUs}
              onChange={handleInputChange}
              placeholder="Tell us about your company..."
              rows={6}
              className={styles.textarea}
            />
            {errors.aboutUs && (
              <span className={styles.error}>{errors.aboutUs}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleSubmit}
              className={styles.btnSubmit}
            >
              Submit Booking
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={styles.btnReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}