"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./../styles/HeroSection.module.css";

const destinations = [
  {
    label: "Care Made Simple, Love Made Furrever.",
    title: "Welcome to FurrEver",
    description:
      "Discover a one-stop hub for pet shopping and services. Find trusted vendors nearby or order products from anywhere — designed to make pet care easier and happier.",
    img: "https://i.pinimg.com/1200x/9e/20/55/9e205537b6535b01a33b04ff24e8baea.jpg",
  },
  {
    label: "FurrEver",
    title: "Grooming Services",
    description:
      "Book grooming sessions for your pets, including baths, haircuts, nail trimming, and more. Find nearby grooming centers and choose a time that works best for you.",
    img: "https://i.pinimg.com/1200x/86/59/9c/86599ca51bd289b86a0e87ba3f3adfb1.jpg",
  },
  {
    label: "FurrEver",
    title: "Veterinary Care",
    description:
      "Schedule appointments with certified veterinarians for regular check-ups, vaccinations, or urgent health concerns. Quickly find available vets near your location.",
    img: "https://i.pinimg.com/1200x/76/28/76/762876441c9ac51b1bef0800de39433b.jpg",
  },
  {
    label: "FurrEver",
    title: "Pet Hostel",
    description:
      "Reserve safe and comfortable hostel stays for your pets while you are away. Hostels provide daily care, feeding, and a friendly environment for your furry friends.",
    img: "https://i.pinimg.com/736x/6b/e2/4c/6be24c63a21773b534f55009f9a6973b.jpg",
  },
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = destinations[activeIndex];

  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <div className={styles.heroLabel}>{active.label}</div>

          <h1 className={styles.heroTitle}>{active.title}</h1>

          <p className={styles.heroDescription}>{active.description}</p>

          <Link href="/users/petServices/grooming" className={styles.discoverBtn}>
            <span className={styles.btnIcon}>📍</span>
            Discover Location
          </Link>
        </div>

        <div className={styles.cardSliderContainer}>
          <div className={styles.cardSlider}>
            {destinations.map((item, i) => (
              <div
                key={i}
                className={styles.destinationCard}
                onClick={() => setActiveIndex(i)}
                style={{
                  transform:
                    activeIndex === i ? "translateY(-10px)" : undefined,
                }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className={styles.cardImage}
                />
                <div className={styles.cardOverlay}>
                  <div className={styles.cardSubtitle}>FurrEver</div>
                  <div className={styles.cardTitle}>{item.title}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.sliderControls}>
            <div className={styles.sliderProgress}>
              <div
                className={styles.progressBar}
                style={{
                  width: `${((activeIndex + 1) / destinations.length) * 100}%`,
                }}
              />
            </div>

            <div className={styles.slideCounter}>
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <div className={styles.expandIcon}>⤢</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
