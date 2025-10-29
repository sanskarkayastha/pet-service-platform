'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Upload, Check } from 'lucide-react';
import './RegistrationForm.css';

export default function RegistrationForm() {
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

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: string
  ): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fileType]: file.name
      }));
    }
  };

  const handleDragDrop = (
    e: React.DragEvent<HTMLDivElement>,
    fileType: string
  ): void => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFormData(prev => ({
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
        body: JSON.stringify(formData)
      })
      const result = await response.text()
      console.log(result)
    } catch (error) {
      console.log(error)
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
                    value={formData.businessName}
                    onChange={handleChange}
                    className="form-input"
                  />
                  <span className="input-checkmark">✓</span>
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
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="form-input"
                  />
                  <span className="input-checkmark">✓</span>
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
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                  <span className="input-checkmark">✓</span>
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
                    value={formData.contact}
                    onChange={handleChange}
                    className="form-input"
                  />
                  <span className="input-checkmark">✓</span>
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
                <option>Pet Food Store</option>
                <option>Pet Grooming</option>
                <option>Pet Clinic</option>
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
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows={4}
              />
            </div>
          </div>

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
                  value={formData.panNumber}
                  onChange={handleChange}
                  className="form-input"
                />
                <span className="input-checkmark">✓</span>
              </div>
            </div>

            {/* Business Logo */}
            <div className="form-group">
              <label>
                Upload Business Logo <span className="required">*</span>
              </label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDragDrop(e, 'businessLogo')}
                className="file-upload-area"
              >
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, 'businessLogo')}
                  accept="image/*"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload">
                  <Upload className="file-upload-icon" />
                  <p className="file-upload-text">Click to upload or drag and drop</p>
                  <p className="file-upload-subtext">PNG, JPG, JPEG (max 5MB)</p>
                </label>
              </div>
            </div>

            {/* Documents & Verification Section */}
            <div>
              <h3 className="section-title">Documents & Verification</h3>

              {/* Certification */}
              <div className="form-group">
                <label>
                  Upload Certification/License Image <span className="required">*</span>
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDragDrop(e, 'certificationDoc')}
                  className="file-upload-area"
                >
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, 'certificationDoc')}
                    id="cert-upload"
                  />
                  <label htmlFor="cert-upload">
                    <Upload className="file-upload-icon" />
                    <p className="file-upload-text">Click to upload or drag and drop</p>
                    <p className="file-upload-subtext">PNG, JPG, JPEG (max 5MB)</p>
                  </label>
                </div>
              </div>

              {/* Verification Documents */}
              <div className="form-group">
                <label>
                  Upload Verification Documents <span className="required">*</span>
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDragDrop(e, 'verificationDoc')}
                  className="file-upload-area"
                >
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, 'verificationDoc')}
                    id="verify-upload"
                  />
                  <label htmlFor="verify-upload">
                    <Upload className="file-upload-icon" />
                    <p className="file-upload-text">Click to upload or drag and drop</p>
                    <p className="file-upload-subtext">PNG, JPG, JPEG (max 5MB)</p>
                  </label>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
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

              <button
                onClick={() => {
                  if (currentStep === 1) {
                    setCurrentStep(2);
                  } else {
                    handleSubmit()
                  }
                }}
                disabled={currentStep === 2 && (!formData.confirmAuthentic || !formData.agreeTerms)}
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