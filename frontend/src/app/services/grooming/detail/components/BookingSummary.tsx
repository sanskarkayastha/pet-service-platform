
"use client";
import Link from "next/link";


import React, { useMemo, useState } from "react";
import styles from "../bookingSummary.module.css";
import { Trash2, Plus, Minus } from "lucide-react";
//mport type { BookingItem } from "../typesNotUsed"; // optional if you want consistent types; ignore if not present

export default function BookingSummary({
  items,
  onRemove,
  onQtyChange
}: {
  items: any[];
  onRemove: (serviceId: number) => void;
  onQtyChange: (serviceId: number, qty: number) => void;
}) {
  const [date, setDate] = useState<string>(() => {
    // default to today
    const t = new Date();
    // format yyyy-mm-dd
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [time, setTime] = useState<string>("16:00"); // default 4pm

  const calcItemTotal = (it: any) => {
    const addons = it.addons || [];
    const price = it.service.price + addons.reduce((s: number, a: any) => s + a.price, 0);
    const qty = it.qty ?? 1;
    return price * qty;
  };

  const total = useMemo(() => (items || []).reduce((s: number, it: any) => s + calcItemTotal(it), 0), [items]);

  const handleQty = (serviceId: number, delta: number) => {
    const it = items.find((i) => i.service.id === serviceId);
    const current = it?.qty ?? 1;
    const next = Math.max(1, current + delta);
    if (onQtyChange) onQtyChange(serviceId, next);
  };

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.heading}>Booking Summary</h3>

      <div className={styles.itemsWrap}>
        {items.length === 0 && <div className={styles.empty}>No services selected</div>}

        {items.map((it: any) => (
          <div key={it.service.id} className={styles.itemCard}>
            <div className={styles.itemHead}>
              <div>
                <div className={styles.itemTitle}>{it.service.title}</div>
                <div className={styles.itemMeta}>${it.service.price.toFixed(2)} each</div>

                {(it.addons || []).map((a: any) => (
                  <div key={a.id} className={styles.addonLine}>
                    <span className={styles.addonName}>+ {a.name}</span>
                    <span className={styles.addonPrice}>${a.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.removeWrap}>
                <button className={styles.trash} onClick={() => onRemove(it.service.id)} aria-label="Remove">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className={styles.itemBottom}>
              {/* <div className={styles.qtyControls}>
                <button className={styles.qtyBtn} onClick={() => handleQty(it.service.id, -1)}>
                  <Minus size={14} />
                </button>
                <div className={styles.qty}>{it.qty ?? 1}</div>
                <button className={styles.qtyBtn} onClick={() => handleQty(it.service.id, +1)}>
                  <Plus size={14} />
                </button>
              </div> */}

              <div className={styles.itemTotal}>${calcItemTotal(it).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.formSection}>
        <label className={styles.label}>Appointment Date</label>
        <input className={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <label className={styles.label}>Appointment Time</label>
        <select className={styles.input} value={time} onChange={(e) => setTime(e.target.value)}>
          {/* common time options; replace/more options possible */}
          <option value="09:00">9:00 AM</option>
          <option value="10:00">10:00 AM</option>
          <option value="11:00">11:00 AM</option>
          <option value="13:00">1:00 PM</option>
          <option value="14:00">2:00 PM</option>
          <option value="15:00">3:00 PM</option>
          <option value="16:00">4:00 PM</option>
          <option value="17:00">5:00 PM</option>
        </select>
      </div>

      <div className={styles.totalRow}>
        <div className={styles.totalLabel}>Total</div>
        <div className={styles.totalValue}>${total.toFixed(2)}</div>
      </div>

      <Link 
        href="/services/grooming/detail/receipt" 
        className={styles.ctaBtn}
      >
        Continue to Payment
      </Link>    </aside>
  );
}
