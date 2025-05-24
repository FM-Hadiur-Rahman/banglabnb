import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN; // 🔑 Make sure it's in your .env file

const MapboxAutocomplete = ({ onSelectLocation }) => {
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [90.4125, 23.8103], // Default to Dhaka
      zoom: 9,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: false,
      placeholder: "Search for location...",
    });

    mapRef.current.addControl(geocoder);

    // On result select
    geocoder.on("result", (e) => {
      const { center, place_name } = e.result;
      if (markerRef.current) markerRef.current.remove();

      markerRef.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat(center)
        .addTo(mapRef.current);

      if (typeof onSelectLocation === "function") {
        onSelectLocation({ coordinates: center, address: place_name });
      }

      markerRef.current.on("dragend", () => {
        const newCoords = markerRef.current.getLngLat();
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${newCoords.lng},${newCoords.lat}.json?access_token=${mapboxgl.accessToken}`
        )
          .then((res) => res.json())
          .then((data) => {
            const newPlace = data.features[0]?.place_name || "";
            if (typeof onSelectLocation === "function") {
              onSelectLocation({
                coordinates: [newCoords.lng, newCoords.lat],
                address: newPlace,
              });
            }
          });
      });
    });
  }, [onSelectLocation]);

  return <div className="h-72 rounded overflow-hidden" ref={mapContainerRef} />;
};

export default MapboxAutocomplete;
