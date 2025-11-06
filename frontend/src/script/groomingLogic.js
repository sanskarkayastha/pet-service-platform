export const services = [
  {
    name: "Pawfect Groomers",
    description:
      "Professional pet grooming services with experienced staff. We provide comprehensive grooming solutions for all breeds.",
    rating: 4.8,
    reviews: 234,
    distance: "2.3 km",
    location: "Thamel, Kathmandu",
    image:
      "https://i.pinimg.com/1200x/d8/7c/57/d87c5768c8272a071b1a07046e71467d.jpg",
  },
  {
    name: "Fluffy & Clean Spa",
    description:
      "Premium grooming experience with organic products. Specialized in breed-specific cuts and styling.",
    rating: 4.9,
    reviews: 189,
    distance: "1.8 km",
    location: "Lazimpat, Kathmandu",
    image:
      "https://i.pinimg.com/1200x/bc/77/4a/bc774ad551536130e818dfea04e1ce76.jpg",
  },
];

export function generateCards() {
  const grid = document.getElementById("servicesGrid");
  if (!grid) return;
  grid.innerHTML = "";
  services.forEach((service, index) => {
    const card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `
      <div class="card-image" style="background-image: url('${service.image}')"></div>
      <div class="card-content">
        <div class="vendor-name">${service.name}</div>
        <div class="description">${service.description}</div>
        <div class="card-meta">
          <div class="rating">
            <span>⭐ ${service.rating}</span>
            <span style="opacity: 0.7;">(${service.reviews})</span>
          </div>
          <div class="distance">📍 ${service.distance}</div>
        </div>
        <div class="card-footer">
          <button class="btn-book" onclick="window.openModal(${index})">Book Now</button>
          <button class="btn-details" onclick="window.openModal(${index})">View Details</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

export function updateRadius(value) {
  const radiusValue = document.getElementById("radiusValue");
  if (radiusValue) radiusValue.textContent = `${value} km`;
}

export function detectLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      () => alert("Location detected! Showing services nearby."),
      () => alert("Unable to detect location.")
    );
  }
}

export function searchServices() {
  const searchTerm = document.getElementById("searchInputMain").value.toLowerCase();
  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm)
  );
  const grid = document.getElementById("servicesGrid");
  grid.innerHTML = "";
  if (filtered.length === 0) {
    grid.innerHTML =
      '<p style="text-align:center;color:#888;">No matching services.</p>';
  } else {
    filtered.forEach((service, i) => {
      const card = document.createElement("div");
      card.className = "service-card";
      card.innerHTML = `
        <div class="card-image" style="background-image: url('${service.image}')"></div>
        <div class="card-content">
          <div class="vendor-name">${service.name}</div>
          <div class="description">${service.description}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }
}

export function openModal(index) {
  const modal = document.getElementById("serviceModal");
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
}

export function closeModal() {
  const modal = document.getElementById("serviceModal");
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}

export function showBooking() {
  const section = document.getElementById("bookingSection");
  if (section) {
    section.style.display = "block";
    section.scrollIntoView({ behavior: "smooth" });
  }
}

export function selectDate(el) {
  document.querySelectorAll(".date-slot").forEach((e) => e.classList.remove("selected"));
  el.classList.add("selected");
}

export function selectTime(el) {
  document.querySelectorAll(".time-slot").forEach((e) => e.classList.remove("selected"));
  el.classList.add("selected");
}

export function initPage() {
  window.openModal = openModal;
  generateCards();
}
