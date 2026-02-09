"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  X,
  Image,
} from "lucide-react";
import styles from "../components/Registration.module.css";
import ProgressBar from "./ProgressBar";

interface FileData {
  name: string;
  size: string;
  file: File;
}

interface StepTwoProps {
  formData: {
    panNumber: string;
    businessLogo: FileData | null;
    license: FileData | null;
    verificationDoc: FileData | null;
    confirmAuthenticity: boolean;
    agreeTerms: boolean;
    [key: string]: any;
  };
  setFormData: (data: any) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({
  formData,
  setFormData,
  onBack,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* -------------------- FILE UPLOAD -------------------- */
  const handleFileUpload = (type: string, file: File | null) => {
    if (!file) return;

    setFormData({
      ...formData,
      [type]: {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        file,
      },
    });

    setErrors((prev) => ({ ...prev, [type]: "" }));
  };

  const removeFile = (type: string) => {
    setFormData({ ...formData, [type]: null });
  };

  /* -------------------- VALIDATION -------------------- */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.panNumber?.trim())
      newErrors.panNumber = "PAN / Registration number is required";

    if (!formData.businessLogo)
      newErrors.businessLogo = "Business logo is required";

    if (!formData.license)
      newErrors.license = "License / certification is required";

    if (!formData.verificationDoc)
      newErrors.verificationDoc = "Verification document is required";

    if (!formData.confirmAuthenticity)
      newErrors.confirmAuthenticity = "Please confirm document authenticity";

    if (!formData.agreeTerms)
      newErrors.agreeTerms = "You must agree to terms & conditions";

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  /* -------------------- HANDLE CONTINUE -------------------- */
  const handleContinue = () => {
    if (!validate()) return; // stop if validation fails
    onSubmit(); // move to next step
  };

  return (
    <div>
      <ProgressBar currentStep={2} />

      <h2 className={styles.sectionTitle}>Verification Documents</h2>
      <p className={styles.sectionSubtitle}>
        Upload required documents for verification
      </p>

      {/* -------------------- PAN -------------------- */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          <FileText size={14} color="#FF6B35" />
          Business Registration / PAN Number{" "}
          <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          placeholder="Enter Business Registration / PAN Number"
          className={`${styles.input} ${errors.panNumber ? styles.inputError : ""}`}
          value={formData.panNumber}
          onChange={(e) =>
            setFormData({ ...formData, panNumber: e.target.value })
          }
        />
        {errors.panNumber && (
          <p className={styles.errorText}>{errors.panNumber}</p>
        )}
      </div>

      {/* -------------------- BUSINESS LOGO -------------------- */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Business Logo <span className={styles.required}>*</span>
        </label>

        {formData.businessLogo ? (
          <div className={styles.filePreview}>
            <div className={styles.fileIcon}>
              <Image size={16} color="#FF6B35" />
            </div>
            <div className={styles.fileInfo}>
              <div className={styles.fileName}>
                {formData.businessLogo.name}
              </div>
              <div className={styles.fileSize}>
                {formData.businessLogo.size} • Ready to upload
              </div>
            </div>
            <button
              className={styles.removeBtn}
              onClick={() => removeFile("businessLogo")}
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div
            className={styles.uploadArea}
            onClick={() => document.getElementById("logo-upload")?.click()}
          >
            <div className={styles.uploadText}>
              <span className={styles.uploadTextOrange}>Click to upload</span>{" "}
              or drag and drop
            </div>
            <div className={styles.uploadSubtext}>
              JPG, PNG, JPEG (max 10MB)
            </div>
            <input
              id="logo-upload"
              type="file"
              hidden
              accept=".jpg,.jpeg,.png"
              onChange={(e) =>
                handleFileUpload("businessLogo", e.target.files?.[0] || null)
              }
            />
          </div>
        )}
        {errors.businessLogo && (
          <p className={styles.errorText}>{errors.businessLogo}</p>
        )}
      </div>

      {/* -------------------- LICENSE -------------------- */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          License / Certification <span className={styles.required}>*</span>
        </label>

        {formData.license ? (
          <div className={styles.filePreview}>
            <div className={styles.fileIcon}>
              <Image size={16} color="#FF6B35" />
            </div>
            <div className={styles.fileInfo}>
              <div className={styles.fileName}>{formData.license.name}</div>
              <div className={styles.fileSize}>
                {formData.license.size} • Ready to upload
              </div>
            </div>
            <button
              className={styles.removeBtn}
              onClick={() => removeFile("license")}
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div
            className={styles.uploadArea}
            onClick={() => document.getElementById("license-upload")?.click()}
          >
            <div className={styles.uploadText}>
              <span className={styles.uploadTextOrange}>Click to upload</span>{" "}
              or drag and drop
            </div>
            <div className={styles.uploadSubtext}>
              JPG, PNG, JPEG (max 10MB)
            </div>
            <input
              id="license-upload"
              type="file"
              hidden
              accept=".jpg,.jpeg,.png"
              onChange={(e) =>
                handleFileUpload("license", e.target.files?.[0] || null)
              }
            />
          </div>
        )}
        {errors.license && <p className={styles.errorText}>{errors.license}</p>}
      </div>

      {/* -------------------- VERIFICATION DOC -------------------- */}
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Upload Verification Document{" "}
          <span className={styles.required}>*</span>
        </label>

        {formData.verificationDoc ? (
          <div className={styles.filePreview}>
            <div className={styles.fileIcon}>
              <FileText size={16} color="#FF6B35" />
            </div>
            <div className={styles.fileInfo}>
              <div className={styles.fileName}>
                {formData.verificationDoc.name}
              </div>
              <div className={styles.fileSize}>
                {formData.verificationDoc.size} • Ready to upload
              </div>
            </div>
            <button
              className={styles.removeBtn}
              onClick={() => removeFile("verificationDoc")}
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div
            className={styles.uploadArea}
            onClick={() =>
              document.getElementById("verification-upload")?.click()
            }
          >
            <div className={styles.uploadText}>
              <span className={styles.uploadTextOrange}>Click to upload</span>{" "}
              or drag and drop
            </div>
            <div className={styles.uploadSubtext}>
              PDF format only (max 10MB)
            </div>
            <input
              id="verification-upload"
              type="file"
              hidden
              accept=".pdf"
              onChange={(e) =>
                handleFileUpload("verificationDoc", e.target.files?.[0] || null)
              }
            />
          </div>
        )}
        {errors.verificationDoc && (
          <p className={styles.errorText}>{errors.verificationDoc}</p>
        )}
      </div>

      {/* -------------------- CONFIRMATION -------------------- */}
      <div className={styles.checkboxSection}>
        <h3 className={styles.checkboxHeading}>
          <CheckCircle size={14} color="#FF6B35" />
          Confirmation
        </h3>

        <label className={styles.checkboxItem}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={formData.confirmAuthenticity}
            onChange={(e) =>
              setFormData({
                ...formData,
                confirmAuthenticity: e.target.checked,
              })
            }
          />
          <div className={styles.checkboxLabel}>
            <div className={styles.checkboxTitle}>
              I confirm document authenticity
            </div>
            <div className={styles.checkboxText}>
              All uploaded documents are genuine and accurate.
            </div>
          </div>
        </label>

        {errors.confirmAuthenticity && (
          <p className={styles.errorText}>{errors.confirmAuthenticity}</p>
        )}

        <label className={styles.checkboxItem}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={formData.agreeTerms}
            onChange={(e) =>
              setFormData({ ...formData, agreeTerms: e.target.checked })
            }
          />
          <div className={styles.checkboxLabel}>
            <div className={styles.checkboxTitle}>
              I agree to the terms and conditions
            </div>
            <div className={styles.checkboxText}>
              By proceeding, I accept the{" "}
              <a href="#" className={styles.link}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className={styles.link}>
                Privacy Policy
              </a>
            </div>
          </div>
        </label>

        {errors.agreeTerms && (
          <p className={styles.errorText}>{errors.agreeTerms}</p>
        )}
      </div>

      {/* -------------------- ACTIONS -------------------- */}
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${styles.buttonSecondary}`}
          onClick={onBack}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleContinue}
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default StepTwo;
