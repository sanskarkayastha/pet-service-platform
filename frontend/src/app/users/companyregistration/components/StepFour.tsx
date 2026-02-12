"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./stepFour.module.css";
import ProgressBar from "../components/ProgressBar";

import { MapPin, Search, Navigation, ArrowLeft, Send } from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L, { LatLng, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation"; // for redirect

/* -------------------- FIX LEAFLET MARKER ICON -------------------- */
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* -------------------- MAP CLICK PICKER -------------------- */
const LocationPicker = ({ onPick }: { onPick: (latlng: LatLng) => void }) => {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onPick(e.latlng);
    },
  });
  return null;
};

/* -------------------- MAP RECENTER -------------------- */
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);

  return null;
};

const StepFour = ({ formData, setFormData, onBack, onSubmit }: any) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<LatLng>(
    new LatLng(27.7172, 85.324), // Kathmandu default
  );
  const [locationInfo, setLocationInfo] = useState("");
  const [showOverlay, setShowOverlay] = useState(false); // <-- overlay state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* -------------------- REVERSE GEOCODE -------------------- */
  const fetchAddress = async (lat: number, lng: number) => {
    const res = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: { lat, lon: lng, format: "json" },
    });
    setLocationInfo(res.data.display_name);
  };

  /* -------------------- SEARCH LOCATION -------------------- */
  const handleSearch = async () => {
    if (!search) return;

    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: search, format: "json", limit: 1 },
    });

    if (res.data.length > 0) {
      const place = res.data[0];
      const latlng = new LatLng(parseFloat(place.lat), parseFloat(place.lon));

      setPosition(latlng);
      setLocationInfo(place.display_name);
    }
  };

  /* -------------------- CURRENT LOCATION -------------------- */
  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const latlng = new LatLng(pos.coords.latitude, pos.coords.longitude);
      setPosition(latlng);
      await fetchAddress(latlng.lat, latlng.lng);
    });
  };

  /* -------------------- MAP CLICK -------------------- */
  const handleMapPick = async (latlng: LatLng) => {
    setPosition(latlng);
    await fetchAddress(latlng.lat, latlng.lng);
  };

  /* -------------------- SYNC TO FORM DATA -------------------- */
  useEffect(() => {
    const locationPayload = {
      lat: position.lat,
      lng: position.lng,
      address: locationInfo,
    };

    setFormData((prev: any) => ({
      ...prev,
      location: locationPayload,
    }));
  }, [position, locationInfo, setFormData]);

  /* -------------------- FINAL SUBMIT -------------------- */
  const handleFinalSubmit = async () => {
    try {
      setErrorMessage(null);
      console.log("🚀 FINAL FORM DATA BEFORE SUBMIT:", formData);

      await onSubmit(); // call your API

      // Show overlay popup
      setShowOverlay(true);

      // Redirect after 2 seconds
      setTimeout(() => {}, 2000);
    } catch (err: any) {
      console.error(err);
      const backendMessage =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "";
      const message =
        backendMessage || (typeof err?.message === "string" ? err.message : "");

      // Show a friendly message if the user already has a business
      if (message.includes("Business already exists")) {
        setErrorMessage("You already have a business registered.");
      } else {
        setErrorMessage(
          message || "Something went wrong while submitting. Please try again.",
        );
      }
    }
  };

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
              Lat: {position.lat.toFixed(6)}, Lng: {position.lng.toFixed(6)}
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

          <RecenterMap lat={position.lat} lng={position.lng} />

          <Marker position={[position.lat, position.lng]} />
          <LocationPicker onPick={handleMapPick} />
        </MapContainer>

        <div className={styles.mapHint}>
          <MapPin size={18} />
          Click on map to pin your exact location
        </div>
      </div>

      {/* ACTIONS */}
      <div className={styles.actions}>
        <button className={styles.back} onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </button>

        <button className={styles.submit} onClick={handleFinalSubmit}>
          <Send size={16} /> Submit Registration
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}

      {/* SUCCESS OVERLAY POPUP */}
      {showOverlay && (
        <div className={styles.overlayMessage}>
          ✅ Successfully submitted. Wait for admin verification.
        </div>
      )}
    </div>
  );
};

export default StepFour;
