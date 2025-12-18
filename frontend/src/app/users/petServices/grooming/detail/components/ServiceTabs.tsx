// ============================================
// FILE: ServiceTabs.tsx
// ============================================
"use client";
import React from "react";
import styles from "./serviceTabs.module.css";

export type ServiceTab = {
  key: string;
  label: string;
};

type ServiceTabsProps = {
  tabs: ServiceTab[];
  activeKey: string;
  onChange: (key: string) => void;
};

export default function ServiceTabs({ tabs, activeKey, onChange }: ServiceTabsProps) {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsWrapper}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`${styles.tabButton} ${activeKey === tab.key ? styles.active : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

