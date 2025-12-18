// import React from "react";
// import styles from "./page.module.css";
// import Services from "./components/Services";
// import img1 from "../../../../image/dog-salon.jpg";
// import img2 from "../../../../image/dog-salon2.jpg";
// import img3 from "../../../../image/hero-salon.jpg";

// const Page = () => {
//   return (
//     <div className={styles.container}>
//       {/* Header Section */}
//       <section className={styles.header}>
//         <h1>Pawsome Pet Care</h1>
//         <div className={styles.rating}>
//           <span>⭐ 5.0 (127)</span> • <span>Open until 20:00</span> •{" "}
//           <span>Sector 66, Gurugram</span>
//           <a href="#" className={styles.link}>
//             Get directions
//           </a>
//         </div>

//         <div className={styles.imageGrid}>
//           <div className={styles.mainImage}>
//             <img src={img1.src} alt="Pet Grooming Room" />
//           </div>
//           <div className={styles.sideImages}>
//             <img src={img2.src} alt="Grooming" />
//             <img src={img3.src} alt="Boarding" />
//           </div>
//         </div>
//       </section>

//       {/* Services Section */}
//       <section className={styles.services}>
//         <h2>Our Services</h2>
//         <Services />
//       </section>

//       <hr className={styles.divider} />

//       {/* Customer Reviews */}
//       <section className={styles.reviews}>
//         <h2>Customer Reviews</h2>
//         <div className={styles.reviewGrid}>
//           <div className={styles.reviewCard}>
//             <div className={styles.avatar}>S</div>
//             <div>
//               <h4>Sarah Johnson</h4>
//               <p className={styles.time}>2 weeks ago</p>
//               <p>
//                 Amazing service! The staff was so gentle with my nervous dog.
//                 Grooming was perfect, and my pup came home happy and clean.
//               </p>
//             </div>
//           </div>

//           <div className={styles.reviewCard}>
//             <div className={styles.avatar}>M</div>
//             <div>
//               <h4>Michael Chen</h4>
//               <p className={styles.time}>1 month ago</p>
//               <p>
//                 Best pet care facility in town. Professional, clean, and they
//                 really care about the animals. My cat loves coming here!
//               </p>
//             </div>
//           </div>

//           <div className={styles.reviewCard}>
//             <div className={styles.avatar}>E</div>
//             <div>
//               <h4>Emma Wilson</h4>
//               <p className={styles.time}>3 weeks ago</p>
//               <p>
//                 Great experience overall. The grooming was excellent, though I
//                 had to wait a bit longer than expected.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//         <hr className={styles.divider} />

//       {/* About Us */}
//       <section className={styles.about}>
//         <h2>About Us</h2>
//         <p>
//           Welcome to Pawsome Pet Care, your trusted partner in pet wellness
//           since 2015. We provide grooming, veterinary care, and boarding
//           services for your beloved companions.
//         </p>
//         <p>
//           Our certified professionals combine years of experience with genuine
//           love for animals, ensuring your pet feels safe, comfortable, and
//           loved.
//         </p>
//       </section>

//         <hr className={styles.divider} />

//       {/* Location */}
//       <section className={styles.location}>
//         <h2>Location</h2>
//         <div className={styles.mapBox}>
//           <div className={styles.mapIcon}>📍</div>
//           <p>123 Pet Street, San Francisco, CA 94102</p>
//           <p className={styles.mapNote}>Map integration available</p>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Page;

import React from "react";
import { Star, MapPin } from "lucide-react";
import styles from "./page.module.css";
import Services from "./components/Services";
import img1 from "../../../../image/dog-salon.jpg";
import img2 from "../../../../image/dog-salon2.jpg";
import img3 from "../../../../image/hero-salon.jpg";

/* =====================
   DATA (API-ready)
===================== */

const HEADER_DATA = {
  name: "Pawsome Pet Care",
  rating: 5.0,
  totalReviews: 127,
  openUntil: "20:00",
  address: "Sector 66, Gurugram",
  images: {
    main: img1,
    side: [img2, img3]
  }
};

const REVIEWS = [
  {
    id: 1,
    name: "Sarah Johnson",
    initial: "S",
    time: "2 weeks ago",
    comment:
      "Amazing service! The staff was so gentle with my nervous dog. Grooming was perfect."
  },
  {
    id: 2,
    name: "Michael Chen",
    initial: "M",
    time: "1 month ago",
    comment:
      "Best pet care facility in town. Professional, clean, and they really care about the animals."
  },
  {
    id: 3,
    name: "Emma Wilson",
    initial: "E",
    time: "3 weeks ago",
    comment:
      "Great experience overall. The grooming was excellent, though I had to wait a bit longer."
  }
];

const ABOUT_DATA = {
  title: "About Us",
  paragraphs: [
    "Welcome to Pawsome Pet Care, your trusted partner in pet wellness since 2015.",
    "Our certified professionals combine years of experience with genuine love for animals."
  ]
};

const LOCATION_DATA = {
  title: "Location",
  address: "123 Pet Street, San Francisco, CA 94102",
  note: "Map integration available"
};

/* =====================
   COMPONENT
===================== */

const Page = () => {
  return (
    <div className={styles.container}>
      {/* Header Section */}
      <section className={styles.header}>
        <h1>{HEADER_DATA.name}</h1>

        <div className={styles.rating}>
          <span>
            <Star size={16} fill="#facc15" strokeWidth={0} />{" "}
            {HEADER_DATA.rating} ({HEADER_DATA.totalReviews})
          </span>
          • <span>Open until {HEADER_DATA.openUntil}</span> •{" "}
          <span>{HEADER_DATA.address}</span>
          <a href="#" className={styles.link}>
            Get directions
          </a>
        </div>

        <div className={styles.imageGrid}>
          <div className={styles.mainImage}>
            <img src={HEADER_DATA.images.main.src} alt="Pet Grooming Room" />
          </div>

          <div className={styles.sideImages}>
            {HEADER_DATA.images.side.map((img, idx) => (
              <img key={idx} src={img.src} alt="Service Image" />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.services}>
        <h2>Our Services</h2>
        <Services />
      </section>

      <hr className={styles.divider} />

      {/* Customer Reviews */}
      <section className={styles.reviews}>
        <h2>Customer Reviews</h2>

        <div className={styles.reviewGrid}>
          {REVIEWS.map(review => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.avatar}>{review.initial}</div>

              <div>
                <h4>{review.name}</h4>
                <p className={styles.time}>{review.time}</p>
                <p>{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className={styles.divider} />

      {/* About Us */}
      <section className={styles.about}>
        <h2>{ABOUT_DATA.title}</h2>

        {ABOUT_DATA.paragraphs.map((text, idx) => (
          <p key={idx}>{text}</p>
        ))}
      </section>

      <hr className={styles.divider} />

      {/* Location */}
      <section className={styles.location}>
        <h2>{LOCATION_DATA.title}</h2>

        <div className={styles.mapBox}>
          <MapPin size={28} />
          <p>{LOCATION_DATA.address}</p>
          <p className={styles.mapNote}>{LOCATION_DATA.note}</p>
        </div>
      </section>
    </div>
  );
};

export default Page;
