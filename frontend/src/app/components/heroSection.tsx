"use client";
import "./../styles/HeroSection.css";

export default function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-label">Care Made Simple, Love Made Furrever.</div>
          <h1 className="hero-title">Welcome to FurrEver</h1>
          <p className="hero-description">
            Discover a one-stop hub for pet shopping and services. Find trusted vendors nearby or order products from anywhere — designed to make pet care easier and happier.
          </p>
          <button className="discover-btn">
            <span className="btn-icon">📍</span>
            Discover Location
          </button>
        </div>

        <div className="card-slider-container">
          <div className="card-slider" id="cardSlider">
            {[
              { title: "FurrEver", img: "https://i.pinimg.com/1200x/9e/20/55/9e205537b6535b01a33b04ff24e8baea.jpg" },
              { title: "Pet Store", img: "https://i.pinimg.com/736x/b3/b0/59/b3b0596511db909334c4fb34942d2b54.jpg" },
              { title: "Grooming Services", img: "https://i.pinimg.com/736x/8c/04/7e/8c047e8e532d73cddb858870fca03860.jpg" },
              { title: "Veterinary Care", img: "https://i.pinimg.com/1200x/76/28/76/762876441c9ac51b1bef0800de39433b.jpg" },
              { title: "Pet Hostel", img: "https://i.pinimg.com/736x/6b/e2/4c/6be24c63a21773b534f55009f9a6973b.jpg" },
            ].map((item, i) => (
              <div className="destination-card" key={i}>
                <img src={item.img} alt={item.title} className="card-image" />
                <div className="card-overlay">
                  <div className="card-subtitle">FurrEver</div>
                  <div className="card-title">{item.title}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="slider-controls">
            <button className="slider-btn">‹</button>
            <button className="slider-btn">›</button>
            <div className="slider-progress">
              <div className="progress-bar"></div>
            </div>
            <div className="slide-counter">
              <span>01</span>
              <div className="expand-icon">⤢</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
