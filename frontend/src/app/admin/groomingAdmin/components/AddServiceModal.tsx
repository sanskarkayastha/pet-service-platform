'use client';

import { useState } from 'react';
import styles from './addServiceModal.module.css';
import { X, Plus, Trash2 } from 'lucide-react';

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

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddServiceModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<ServiceForm>({
    title: '',
    shortDescription: '',
    detailedDescription: '',
    duration: '',
    basePrice: '',
    addOns: [{ title: '', description: '', price: '' }]
  });

  if (!isOpen) return null;

  /* ------------------ BASIC FIELD HANDLER ------------------ */
  const handleChange = (field: keyof ServiceForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  /* ------------------ ADD-ON HANDLERS ------------------ */
  const handleAddOnChange = (
    index: number,
    field: keyof AddOn,
    value: string
  ) => {
    const updated = [...form.addOns];
    updated[index][field] = value;
    setForm({ ...form, addOns: updated });
  };

  const addNewAddOn = () => {
    setForm({
      ...form,
      addOns: [...form.addOns, { title: '', description: '', price: '' }]
    });
  };

  const removeAddOn = (index: number) => {
    const updated = form.addOns.filter((_, i) => i !== index);
    setForm({ ...form, addOns: updated });
  };

  /* ------------------ SAVE ------------------ */
  const handleSave = () => {
    const cleanedAddOns = form.addOns.filter(a => a.title.trim() !== '');

    const payload = {
      ...form,
      basePrice: Number(form.basePrice),
      addOns: cleanedAddOns.map(a => ({
        ...a,
        price: Number(a.price)
      }))
    };

    console.log('SERVICE PAYLOAD:', payload);

    // 👉 SEND TO BACKEND HERE

    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <h2>Add New Service</h2>
            <p>This service will be visible to customers during booking</p>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className={styles.body}>
          <h4>BASIC SERVICE INFORMATION</h4>

          <label>Service Title</label>
          <input
            placeholder="e.g., Full Grooming Package"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />

          <label>Short Description</label>
          <input
            placeholder="One-line summary for service cards"
            value={form.shortDescription}
            onChange={(e) =>
              handleChange('shortDescription', e.target.value)
            }
          />
          <small>Used in service list cards</small>

          <label>Detailed Description</label>
          <textarea
            placeholder="Detailed description..."
            value={form.detailedDescription}
            onChange={(e) =>
              handleChange('detailedDescription', e.target.value)
            }
          />
          <small>Shown in service detail modal</small>

          <h4>TIME & PRICING</h4>

          <div className={styles.row}>
            <div>
              <label>Estimated Duration</label>
              <input
                placeholder="e.g., 2-3 hours"
                value={form.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
              />
            </div>

            <div>
              <label>Base Price</label>
              <input
                placeholder="Rs 0"
                value={form.basePrice}
                onChange={(e) =>
                  handleChange(
                    'basePrice',
                    e.target.value.replace(/\D/g, '')
                  )
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
                  handleAddOnChange(index, 'title', e.target.value)
                }
              />
              <input
                placeholder="Short description"
                value={addOn.description}
                onChange={(e) =>
                  handleAddOnChange(index, 'description', e.target.value)
                }
              />
              <input
                placeholder="Rs 0"
                value={addOn.price}
                onChange={(e) =>
                  handleAddOnChange(
                    index,
                    'price',
                    e.target.value.replace(/\D/g, '')
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

        {/* FOOTER */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={handleSave}>
            Save Service
          </button>
        </div>
      </div>
    </div>
  );
}
