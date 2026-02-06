"use client";

import { useState } from "react";
import styles from "./ProfileSettings.module.css";

export default function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false);

  const [userData, setUserData] = useState({
    fullName: "John Doe",
    email: "example@mail.com",
    phone: "9812345678",
    petDescription: "My dog loves to play fetch!",
  });

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Save API call here
    console.log("Saved data:", userData);
    setIsEditing(false);
  };

  return (
    <div className={styles.profileWrapper}>
      {/* RIGHT COLUMN */}
      <div className={styles.profileRight}>
        <h3 className={styles.sectionTitle}>Basic Information</h3>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={userData.fullName}
              onChange={handleChange}
              readOnly={!isEditing}
              className={!isEditing ? styles.readOnlyInput : ""}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className={!isEditing ? styles.readOnlyInput : ""}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={userData.phone}
              onChange={handleChange}
              readOnly={!isEditing}
              className={!isEditing ? styles.readOnlyInput : ""}
            />
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Your Pet</h3>

        <div className={styles.formGroup}>
          <label>Short Description of Your Pet</label>
          <textarea
            name="petDescription"
            value={userData.petDescription}
            onChange={handleChange}
            readOnly={!isEditing}
            className={!isEditing ? styles.readOnlyInput : ""}
          />
        </div>

        <div className={styles.saveBtns}>
          {isEditing ? (
            <>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={handleEditToggle}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleEditToggle}
              >
                Edit
              </button>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => console.log("Change Password clicked")}
              >
                Change Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
