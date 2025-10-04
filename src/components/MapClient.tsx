// @ts-nocheck
"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";

export default function MapClient() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Initialize map
    const map = L.map(ref.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Tile layer (OSM)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 19,
    }).addTo(map);

    // Custom blinking marker using DivIcon
    const makeMarker = (lat: number, lng: number, text: string) => {
      const icon = L.divIcon({
        className: "",
        html: '<div class="blink" style="width:14px;height:14px;border-radius:50%;background:#2E7D32;box-shadow:0 0 0 4px rgba(255,255,255,0.85);"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      const m = L.marker([lat, lng], { icon }).addTo(map);
      m.bindPopup(text);
      return m;
    };

    const points = [
      [28.6139, 77.209, "Soil Moisture: 23% | Rainfall: 12mm | NDVI: 0.62"],
      [19.076, 72.8777, "Soil Moisture: 18% | Rainfall: 5mm | NDVI: 0.55"],
      [12.9716, 77.5946, "Soil Moisture: 27% | Rainfall: 20mm | NDVI: 0.70"],
    ] as const;
    const markers = points.map(([lat, lng, text]) => makeMarker(lat, lng, text));

    return () => {
      markers.forEach((m) => m.remove());
      map.remove();
    };
  }, []);

  return <div ref={ref} className="w-full aspect-[16/10] rounded-xl overflow-hidden" />;
}
