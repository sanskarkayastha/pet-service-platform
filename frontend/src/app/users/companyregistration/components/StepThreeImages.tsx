import React, { useState } from "react";
import {
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  X,
  Plus,
} from "lucide-react";
import styles from "../components/Registration.module.css";
import ProgressBar from "./ProgressBar";

interface StepThreeProps {
  formData: any;
  setFormData: (data: any) => void;
  onBack: () => void;
  onNext: () => void;
}

const StepThreeImages: React.FC<StepThreeProps> = ({
  formData,
  setFormData,
  onBack,
  onNext,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ===== MAIN IMAGE ===== */
  const handleMainImage = (file: File | null) => {
    if (!file) return;

    setFormData({
      ...formData,
      mainShopImage: {
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
      },
    });

    setErrors({});
  };

  const removeMainImage = () => {
    setFormData({ ...formData, mainShopImage: null });
  };

  /* ===== ADDITIONAL IMAGES ===== */
  const handleAdditionalImages = (files: FileList | null) => {
    if (!files) return;

    const images = Array.from(files).map((file) => ({
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
    }));

    setFormData({
      ...formData,
      additionalImages: [...(formData.additionalImages || []), ...images],
    });
  };

  const removeAdditionalImage = (index: number) => {
    const updated = [...formData.additionalImages];
    updated.splice(index, 1);
    setFormData({ ...formData, additionalImages: updated });
  };

  /* ===== VALIDATION ===== */
  const validate = () => {
    if (!formData.mainShopImage) {
      setErrors({ mainShopImage: "Main shop image is required" });
      return false;
    }
    return true;
  };

  return (
    <div>
      <ProgressBar currentStep={3} />
      <h2 className={styles.sectionTitle}>Shop Images</h2>
      <p className={styles.sectionSubtitle}>Upload images of your business</p>

      {/* ================= MAIN IMAGE ================= */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <ImageIcon size={14} color="#FF6B35" />
          Main Shop Image <span className={styles.required}>*</span>
        </label>

        {formData.mainShopImage ? (
          <div className={styles.filePreview}>
            <div className={styles.fileIcon}>
              <ImageIcon size={16} color="#FF6B35" />
            </div>
            <div className={styles.fileInfo}>
              <div className={styles.fileName}>
                {formData.mainShopImage.name}
              </div>
              <div className={styles.fileSize}>
                {formData.mainShopImage.size} • Ready to upload
              </div>
            </div>
            <button className={styles.removeBtn} onClick={removeMainImage}>
              <X size={18} />
            </button>
          </div>
        ) : (
          <div
            className={styles.uploadArea}
            onClick={() =>
              document.getElementById("main-image-upload")?.click()
            }
          >
            <div className={styles.uploadText}>
              <span className={styles.uploadTextOrange}>Click to upload</span>{" "}
              or drag and drop
            </div>
            <div className={styles.uploadSubtext}>
              JPG, PNG, WebP (max 10MB)
            </div>
            <input
              id="main-image-upload"
              type="file"
              hidden
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) => handleMainImage(e.target.files?.[0] || null)}
            />
          </div>
        )}

        {errors.mainShopImage && (
          <p className={styles.errorText}>{errors.mainShopImage}</p>
        )}
      </div>

      {/* ================= ADDITIONAL IMAGES ================= */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <Plus size={14} color="#FF6B35" />
          Additional Images <span className={styles.optional}>(Optional)</span>
        </label>

        <div
          className={styles.uploadArea}
          onClick={() =>
            document.getElementById("additional-images-upload")?.click()
          }
        >
          <div className={styles.uploadIcon}>
            <Plus size={22} />
          </div>
          <div className={styles.uploadText}>
            <span className={styles.uploadTextOrange}>Click to upload</span> or
            drag and drop
          </div>
          <div className={styles.uploadSubtext}>
            Add more photos of your shop
          </div>
          <input
            id="additional-images-upload"
            type="file"
            hidden
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            onChange={(e) => handleAdditionalImages(e.target.files)}
          />
        </div>

        {formData.additionalImages?.length > 0 && (
          <div className={styles.imageList}>
            {formData.additionalImages.map((img: any, index: number) => (
              <div key={index} className={styles.filePreview}>
                <div className={styles.fileIcon}>
                  <ImageIcon size={16} />
                </div>
                <div className={styles.fileInfo}>
                  <div className={styles.fileName}>{img.name}</div>
                  <div className={styles.fileSize}>{img.size}</div>
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeAdditionalImage(index)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= BUTTONS ================= */}
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={() => {
            if (!validate()) return;
            onNext();
          }}
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default StepThreeImages;
