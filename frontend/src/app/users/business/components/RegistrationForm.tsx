'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Upload, Check , X } from 'lucide-react';
import './RegistrationForm.css';

export default function RegistrationForm() {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleDragDrop = (
    e: React.DragEvent<HTMLDivElement>,
    fileType: string
  ): void => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImgData(prev => ({
        ...prev,
        [fileType]: file.name
      }));
    }
  };

  const handleSubmit = async (): Promise<void> => {
    console.log('Submitting form data:', formData);
    try {
      const response = await fetch('http://localhost:8080/api/business/addBusiness',{
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imgData)
      })
      const result = await response.text()
      console.log(result)
    } catch (error) {
      console.log(error)
    }

  };
  const [imgData, setImgData] = useState({
    businessLogo: null as File | null,
    certificationDoc: null as File | null,
    verificationDoc: null as File | null,
  });

  const [preview, setPreview] = useState({
    businessLogo: "",
    certificationDoc: "",
    verificationDoc: "",
  });

  // Handle file upload
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "businessLogo" | "certificationDoc" | "verificationDoc"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setImgData((prev) => ({ ...prev, [field]: file }));

      // generate preview
      const fileURL = URL.createObjectURL(file);
      setPreview((prev) => ({ ...prev, [field]: fileURL }));
    }
  };

 

  // Remove image
  const removeImage = (field: "businessLogo" | "certificationDoc" | "verificationDoc") => {
    setImgData((prev) => ({ ...prev, [field]: null }));
    setPreview((prev) => ({ ...prev, [field]: "" }));
  };

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    contact: '',
    address: '',
    serviceType: '',
    description: '',
    panNumber: '',
    businessLogo: null,
    certificationDoc: null,
    verificationDoc: null,
    confirmAuthentic: false,
    agreeTerms: false
    
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const target = e.target;
    const { name, value } = target;
    
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  return (
    <div className="pet-service-container">
      <div className="pet-service-wrapper">
        {/* Header */}
        <div className="pet-service-header">
          <div className="pet-service-header-title">
            <div className="pet-service-icon">🐾</div>
            <h1>Pet Service System</h1>
            <span className="pet-service-emoji">✨</span>
          </div>
          <p className="pet-service-header-subtitle">Vendor Registration</p>
          <p className="pet-service-header-description">
            Join our network of trusted pet service providers. Help pet parents find the best care for their furry friends!
          </p>
        </div>

        {/* Main Form Container */}
        <div className="pet-service-form-container">
          {/* Step Indicators */}
          <div className="step-indicators">
            <div className="step-indicator">
              <div className={`step-circle ${currentStep >= 1 ? 'active' : 'inactive'}`}>
                {currentStep > 1 ? <Check size={24} /> : '1'}
              </div>
              <h3>Business Details</h3>
              <p>Basic information</p>
            </div>

            <div className="step-line"></div>

            <div className="step-indicator">
              <div className={`step-circle ${currentStep >= 2 ? 'active' : 'inactive'}`}>
                2
              </div>
              <h3>Service Info & Documents</h3>
              <p>Final step</p>
            </div>
          </div>

          {/* Step 1: Business Details */}
          <div className={`form-content ${currentStep === 1 ? 'active' : ''}`}>
            <div className="form-group grid-2">
              {/* Business Name */}
              <div>
                <label>
                  Business Name <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Enter your business name..."
                    value={formData.businessName}
                    onChange={handleChange}
                    className="form-input"
                  />                      
                   </div>
              </div>

              {/* Owner Name */}
              <div>
                <label>
                  Owner Full Name <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="ownerName"
                    placeholder="Enter owner name..."
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label>
                  Email Address <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email..."
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <label>
                  Contact Number <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="tel"
                    name="contact"
                    placeholder="Enter your contact..."
                    value={formData.contact}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Business Address */}
            <div className="form-group">
              <label>
                Business Address <span className="required">*</span>
              </label>
              <textarea
                name="address"
                placeholder="Enter your address..."
                value={formData.address}
                onChange={handleChange}
                className="form-textarea"
                rows={3}
              />
            </div>

            {/* Service Type */}
            <div className="form-group">
              <label>
                Service Type <span className="required">*</span>
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="form-select"
              >
                <option>Pet Grooming</option>
                <option>Vet</option>
                <option>Pet Hotel</option>
              </select>
            </div>

            {/* Business Description */}
            <div className="form-group">
              <label>
                Business Description <span className="required">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Enter the description..."
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows={4}
              />
            </div>
          </div>
{/* ===========================================2nd page=========================================== */}
          {/* Step 2: Documents & Verification */}
          <div className={`form-content ${currentStep === 2 ? 'active' : ''} form-content.space-y-8`}>
            {/* PAN Number */}
            <div className="form-group">
              <label>
                PAN Number / Business Registration No. <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="panNumber"
                  placeholder="Enter Pan number / Registration number..."
                  value={formData.panNumber}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Business Logo */}
              <div className="form-group">
                <label>
                  Upload Business Logo <span className="required">*</span>
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDragDrop(e, "businessLogo")}
                  className="file-upload-area"
                >
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "businessLogo")}
                    accept="image/*"
                    id="logo-upload"
                    hidden
                  />

                  {/* Show upload text only when no image is uploaded */}
                  {!preview.businessLogo ? (
                    <label htmlFor="logo-upload">
                      <Upload className="file-upload-icon" />
                      <p className="file-upload-text">Click to upload or drag and drop</p>
                      <p className="file-upload-subtext">PNG, JPG, JPEG (max 5MB)</p>
                    </label>
                  ) : (
                    // Show image preview inside the box
                    <div className="preview-inside-box">
                      <img
                        src={preview.businessLogo}
                        alt="Business Logo"
                        className="preview-image-inside"
                      />
                      <button
                        type="button"
                        className="remove-btn-inside"
                        onClick={() => removeImage("businessLogo")}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>


              {/* Certification */}
              <div className="form-group">
                <label>
                  Upload Certification/License Image <span className="required">*</span>
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDragDrop(e, "certificationDoc")}
                  className="file-upload-area"
                >
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "certificationDoc")}
                    accept="image/*"
                    id="cert-upload"
                    hidden
                  />

                  {/* Show upload text only if no image is uploaded */}
                  {!preview.certificationDoc ? (
                    <label htmlFor="cert-upload">
                      <Upload className="file-upload-icon" />
                      <p className="file-upload-text">Click to upload or drag and drop</p>
                      <p className="file-upload-subtext">PNG, JPG, JPEG (max 5MB)</p>
                    </label>
                  ) : (
                    // Show image preview inside the box
                    <div className="preview-inside-box">
                      <img
                        src={preview.certificationDoc}
                        alt="Certification"
                        className="preview-image-inside"
                      />
                      <button
                        type="button"
                        className="remove-btn-inside"
                        onClick={() => removeImage("certificationDoc")}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>


              {/* Verification Documents */}
              <div className="form-group">
                <label>
                  Upload Verification Documents <span className="required">*</span>
                </label>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDragDrop(e, "verificationDoc")}
                  className={`file-upload-area ${preview.verificationDoc ? "has-image" : ""}`}
                >
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "verificationDoc")}
                    accept="image/*"
                    id="verify-upload"
                    hidden
                  />

                  {!preview.verificationDoc ? (
                    <label htmlFor="verify-upload" className="upload-placeholder">
                      <Upload className="file-upload-icon" />
                      <p className="file-upload-text">Click to upload or drag and drop</p>
                      <p className="file-upload-subtext">PNG, JPG, JPEG (max 5MB)</p>
                    </label>
                  ) : (
                    <div className="preview-inside-box">
                      <img src={preview.verificationDoc} alt="Verification" className="preview-image-inside" />
                      <button className="remove-btn-inside" onClick={() => removeImage("verificationDoc")}>
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>


            {/*=============== ==Checkboxes ===================*/}
            <div>
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  name="confirmAuthentic"
                  checked={formData.confirmAuthentic}
                  onChange={handleChange}
                />
                <div>
                  <span className="checkbox-label">
                    I confirm that all uploaded documents are authentic and verified <span className="required">*</span>
                  </span>
                  <p className="checkbox-sublabel">
                    False information may result in rejection or account suspension
                  </p>
                </div>
              </label>

              <label className="checkbox-group">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <div>
                  <span className="checkbox-label">
                    I agree to the{' '}
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      Privacy Policy
                    </a>{' '}
                    <span className="required">*</span>
                  </span>
                  <p className="checkbox-sublabel">
                    You must agree to continue with registration
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="form-footer">
            <button className="btn btn-draft">
              <span>💾</span>
              Save as Draft
            </button>

            <div className="button-group">
              {currentStep === 2 && (
                <button
                  onClick={() => setCurrentStep(1)}
                  className="btn btn-back"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
              )}             
                 {/* Warning message below button */}
              {errorMessage && (
                <p style={{ color: "red", marginTop: "-25px", fontSize: "14px", marginRight: "-118px" }}>
                  {errorMessage}
                </p>
              )}
              <button
                onClick={() => {
                  if (currentStep === 1) {
                    // check if all required fields are filled
                    if (
                      formData.businessName.trim() &&
                      formData.ownerName.trim() &&
                      formData.email.trim() &&
                      formData.contact.trim() &&
                      formData.address.trim() &&
                      formData.serviceType.trim() &&
                      formData.description.trim()
                    ) {
                      setErrorMessage(""); // clear any old warning
                      setCurrentStep(2); // proceed to next step
                    } else {
                      setErrorMessage("⚠️ Please fill in all required fields before proceeding.");
                    }
                  } else {
                    handleSubmit();
                  }
                }}
                className="btn btn-primary"
              >
                {currentStep === 1 ? (
                  <>
                    Next
                    <ChevronRight size={18} />
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Submit Registration
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}