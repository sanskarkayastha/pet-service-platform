'use client';

import { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';
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
  { id: 'grooming', label: 'Pet Grooming', icon: '✂️' },
  { id: 'hostel', label: 'Pet Hostel', icon: '🏠' },
  { id: 'vet', label: 'Veterinary', icon: '⚕️' },
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

  // Handle text input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle service selection
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

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const newImages: ImagePreview[] = [];

    Array.from(files).forEach((file) => {
      if (imagePreviews.length + newImages.length < 3) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            file,
            preview: reader.result as string,
          });
          if (newImages.length === Array.from(files).length) {
            setImagePreviews((prev) => [...prev, ...newImages]);
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, ...newImages.map((img) => img.file)],
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Reset input
    e.currentTarget.value = '';
  };

  // Remove image
  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Validate form
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Simulate API call
    console.log('Form Data:', {
      ...formData,
      images: imagePreviews.map((img) => img.preview),
    });

    setSubmitted(true);
    // Reset form after 2 seconds
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

  if (submitted) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <Check size={64} />
          </div>
          <h2>Booking Submitted Successfully!</h2>
          <p>Your company information has been registered. Our team will review and get back to you soon.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainContent}>
      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <h1>New Booking</h1>
          <p>Register your company and select services</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Company Name */}
          <div className={styles.formGroup}>
            <label htmlFor="companyName">Company Name *</label>
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
            <label htmlFor="companyAddress">Company Address *</label>
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
            <label>Company Images (Upload up to 3 images) *</label>
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
                className={styles.uploadBox}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={32} />
                <p>Click to upload or drag and drop</p>
                <span>PNG, JPG, GIF up to 10MB</span>
              </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className={styles.imageGrid}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} className={styles.imageCard}>
                    <img src={preview.preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className={styles.removeBtn}
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.imageCounter}>
              {imagePreviews.length} / 3 images uploaded
            </div>

            {errors.images && (
              <span className={styles.error}>{errors.images}</span>
            )}
          </div>

          {/* Service Selection */}
          <div className={styles.formGroup}>
            <label>Select Services *</label>
            <div className={styles.servicesGrid}>
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`${styles.serviceCard} ${
                    formData.selectedServices.includes(service.id)
                      ? styles.selected
                      : ''
                  }`}
                  onClick={() => handleServiceToggle(service.id)}
                >
                  <div className={styles.serviceIcon}>{service.icon}</div>
                  <p>{service.label}</p>
                  {formData.selectedServices.includes(service.id) && (
                    <div className={styles.checkmark}>
                      <Check size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.selectedServices && (
              <span className={styles.error}>{errors.selectedServices}</span>
            )}
          </div>

          {/* About Us */}
          <div className={styles.formGroup}>
            <label htmlFor="aboutUs">About Us *</label>
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
            <button type="submit" className={styles.btnSubmit}>
              Submit Booking
            </button>
            <button type="reset" className={styles.btnReset}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}