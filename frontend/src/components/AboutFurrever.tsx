import { ArrowRight, Star } from "lucide-react";
import styles from "./AboutFurrever.module.css";

const stats = [
  {
    value: "1",
    label: "Happy Pet Parents",
    desc: "Pet owners trust Furrever for safe, reliable, and loving services — from grooming to boarding and vet care."
  },
  {
    value: "2",
    label: "Verified Pet Businesses",
    desc: "We connect you with trusted, reviewed, and verified pet service providers in one convenient platform."
  },
  {
    value: "3",
    label: "Easy Online Booking",
    desc: "Book grooming, vet visits, pet sitting, or boarding anytime with a smooth and stress-free experience."
  },
  {
    value: "4",
    label: "Pet Care Service",
    desc: "Furrever helps thousands of pets receive the care, attention, and love they deserve every day."
  },
];

export default function AboutFurrever() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>

        {/* HERO */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.heroLeft}>
              <div className={styles.ratingBadge}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} color="#f4a261" fill="#f4a261" />
                ))}
                Loved by pet parents
              </div>

              <h1 className={styles.heading}>
                All Your Pet Care Services in One Place
              </h1>

              <p className={styles.text}>
                Furrever connects pet owners with trusted groomers, vets,
                trainers, and boarding services — making pet care easy,
                safe, and stress-free.
              </p>

              <div className={styles.buttons}>
                <button className={styles.primaryBtn}>
                  Book a Service <ArrowRight size={16} />
                </button>
                <button className={styles.secondaryBtn}>
                  Explore Services
                </button>
              </div>
            </div>

            <div className={styles.heroImage}>
              <img src="https://i.pinimg.com/1200x/8b/19/6d/8b196ddfd11041b6efdee86e9a872b12.jpg" alt="Pet care service" />
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className={styles.statsSection}>
          <div className={styles.statsContainer}>
            <div className={styles.statsImage}>
              <img src="https://i.pinimg.com/736x/c0/67/a1/c067a16dda4b4114678409b4f0ed233e.jpg" alt="Happy pets" />
            </div>

            <div className={styles.statsList}>
              {stats.map((stat) => (
                <div key={stat.value} className={styles.statCard}>
                  <div>
                    <div className={styles.statValue}>{stat.value}</div>
                    <div className={styles.statLabel}>{stat.label}</div>
                  </div>
                  <p className={styles.statDesc}>{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
