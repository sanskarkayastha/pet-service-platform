"use client";

import { useEffect, useRef, useState } from "react";
import "./HomePage.css";
import Link from "next/link";

interface Destination {
  label: string;
  title: string;
  description: string;
  image?: string;
}

const destinations: Destination[] = [
  {
    label:'Care Made Simple, Love Made Furrever.',
    title: 'Welcome to FurrEver',
    description: 'Discover a one-stop hub for pet shopping and services. Find trusted vendors nearby or order products from anywhere — designed to make pet care easier and happier.',
    image: 'https://i.pinimg.com/1200x/9e/20/55/9e205537b6535b01a33b04ff24e8baea.jpg'
  },
  {
    label: 'FurrEver',
    title: 'Pet Shop',
    description: 'Browse and shop for pet food, toys, accessories, and essentials from trusted vendors. Products can be ordered from anywhere and delivered to your doorstep.',
    image: 'https://i.pinimg.com/736x/b3/b0/59/b3b0596511db909334c4fb34942d2b54.jpg'
  },
  {
    label: 'FurrEver',
    title: 'Grooming',
    description: 'Book grooming sessions for your pets, including baths, haircuts, nail trimming, and more. Find nearby grooming centers and choose a time that works best for you.',
    image: 'https://i.pinimg.com/736x/8c/04/7e/8c047e8e532d73cddb858870fca03860.jpg'
  },
  {
    label: 'FurrEver',
    title: 'Veterinary Care',
    description: 'Schedule appointments with certified veterinarians for regular check-ups, vaccinations, or urgent health concerns. Quickly find available vets near your location.',
    image: 'https://i.pinimg.com/1200x/76/28/76/762876441c9ac51b1bef0800de39433b.jpg'
  },
  {
    label: 'FurrEver',
    title: 'Pet Hostel',
    description: 'Reserve safe and comfortable hostel stays for your pets while you are away. Hostels provide daily care, feeding, and a friendly environment for your furry friends.',
    image: 'https://i.pinimg.com/736x/6b/e2/4c/6be24c63a21773b534f55009f9a6973b.jpg'
  }
];

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const heroLabelRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDescriptionRef = useRef<HTMLParagraphElement>(null);

  const updateHeroContent = (index: number) => {
    const dest = destinations[index];
    if (!heroLabelRef.current || !heroTitleRef.current || !heroDescriptionRef.current) return;

    heroLabelRef.current.style.opacity = '0';
    heroTitleRef.current.style.opacity = '0';
    heroDescriptionRef.current.style.opacity = '0';

    setTimeout(() => {
      heroLabelRef.current!.textContent = dest.label;
      heroTitleRef.current!.textContent = dest.title;
      heroDescriptionRef.current!.textContent = dest.description;

      heroLabelRef.current!.style.transition = 'opacity 0.5s ease';
      heroTitleRef.current!.style.transition = 'opacity 0.5s ease';
      heroDescriptionRef.current!.style.transition = 'opacity 0.5s ease';

      heroLabelRef.current!.style.opacity = '1';
      heroTitleRef.current!.style.opacity = '1';
      heroDescriptionRef.current!.style.opacity = '1';
    }, 300);
  };

  const updateSlider = (index: number) => {
    if (!sliderRef.current) return;
    const cards = sliderRef.current.querySelectorAll<HTMLDivElement>('.destination-card');
    const cardWidth = cards[0].offsetWidth + 24;

    sliderRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });

    updateHeroContent(index);
  };

  useEffect(() => {
    updateSlider(currentIndex);
  }, [currentIndex]);

  return (
    <div>
      <nav>
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon">🌍</div>
            FurrEver
          </div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#shop">Pet Shop</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#cart">Cart</a></li>
          </ul>
          <div className="nav-icons">
            <span>🔍</span>
            <span>👤</span>
            <button>Sign Up</button>
            <Link href="/users/login">
              <button>Log in</button>
            </Link>
          </div>
          <div className="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-label" ref={heroLabelRef}>{destinations[0].label}</div>
            <h1 className="hero-title" ref={heroTitleRef}>{destinations[0].title}</h1>
            <p className="hero-description" ref={heroDescriptionRef}>{destinations[0].description}</p>
            <button className="discover-btn">
              <span className="btn-icon">📍</span>
              Discover Location
            </button>
          </div>

          <div className="card-slider-container">
            <div className="card-slider" ref={sliderRef}>
              {destinations.map((dest, index) => (
                <div key={index} className="destination-card" onClick={() => setCurrentIndex(index)}>
                  <img src={dest.image} alt={dest.title} className="card-image" />
                  <div className="card-overlay">
                    <div className="card-subtitle">FurrEver</div>
                    <div className="card-title">{dest.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
