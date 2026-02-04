"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./stepFour.module.css";
import ProgressBar from "../components/ProgressBar";

import { MapPin, Search, Navigation, ArrowLeft, Send } from "lucide-react";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { LatLng, type LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

/* -------------------- Location Picker -------------------- */
const LocationPicker = ({ onPick }: { onPick: (latlng: LatLng) => void }) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onPick(e.latlng);
    },
  });
  return null;
};

const StepFour = ({ formData, setFormData, onBack, onSubmit }: any) => {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<LatLng>(
    new LatLng(27.7172, 85.324), // default
  );
  const [locationInfo, setLocationInfo] = useState<string>("");

  /* -------------------- Reverse Geocode -------------------- */
  const fetchAddress = async (lat: number, lng: number) => {
    const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        lat,
        lon: lng,
        format: "json",
      },
    });

    setLocationInfo(res.data.display_name);
  };

  /* -------------------- Search Location -------------------- */
  const handleSearch = async () => {
    if (!search) return;

    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: search,
        format: "json",
        limit: 1,
      },
    });

    if (res.data.length > 0) {
      const place = res.data[0];
      const latlng = new LatLng(place.lat, place.lon);
      setPosition(latlng);
      setLocationInfo(place.display_name);
    }
  };

  /* -------------------- Current Location -------------------- */
  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const latlng = new LatLng(pos.coords.latitude, pos.coords.longitude);
      setPosition(latlng);
      await fetchAddress(latlng.lat, latlng.lng);
    });
  };

  /* -------------------- Map Click -------------------- */
  const handleMapPick = async (latlng: LatLng) => {
    setPosition(latlng);
    await fetchAddress(latlng.lat, latlng.lng);
  };

  /* -------------------- Sync to formData -------------------- */
  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      location: {
        lat: position.lat,
        lng: position.lng,
        address: locationInfo,
      },
    }));
  }, [position, locationInfo]);

  return (
    <div className={styles.container}>
      <ProgressBar currentStep={4} />

      <h3 className={styles.sectionTitle}>Shop Location</h3>
      <p className={styles.sectionDesc}>Help customers find your business</p>

      {/* SEARCH */}
      <div className={styles.searchRow}>
        <Search size={18} />
        <input
          placeholder="Enter your shop address or landmark..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className={styles.or}>OR</div>

      {/* CURRENT LOCATION */}
      <button
        type="button"
        className={styles.locationBtn}
        onClick={useCurrentLocation}
      >
        <Navigation size={16} />
        Use My Current Location
      </button>

      {/* SELECTED LOCATION INFO */}
      {locationInfo && (
        <div className={styles.selectedBox}>
          <MapPin size={16} />
          <div>
            <strong>Location Selected</strong>
            <p>{locationInfo}</p>
            <small>
              Coordinates: {position.lat}, {position.lng}
            </small>
          </div>
        </div>
      )}

      {/* MAP */}
      <div className={styles.mapBox}>
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={14}
          className={styles.map}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <Marker position={[position.lat, position.lng]} />
          <LocationPicker onPick={handleMapPick} />
        </MapContainer>

        <div className={styles.mapHint}>
          <MapPin size={18} />
          Location pinned on map
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.back} onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </button>

        <button className={styles.submit} onClick={onSubmit}>
          <Send size={16} /> Submit Registration
        </button>
      </div>
    </div>
  );
};

export default StepFour;
