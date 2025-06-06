import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapboxAutocomplete = ({ onSelectLocation }) => {
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [90.4125, 23.8103], // Dhaka
      zoom: 9,
    });

    // ✅ Geolocation (center to user)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords;
        mapRef.current.setCenter([longitude, latitude]);
      },
      () => console.warn("📍 Location access denied")
    );

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,
      marker: false,
      placeholder: "Search for location...",
    });

    mapRef.current.addControl(geocoder);

    // ✅ Map click to set marker
    mapRef.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      updateMarker([lng, lat]);
    });

    // ✅ Geocoder result
    geocoder.on("result", (e) => {
      const { center, place_name } = e.result;
      updateMarker(center, place_name);
    });

    function updateMarker(coords, label = null) {
      if (markerRef.current) markerRef.current.remove();

      markerRef.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat(coords)
        .addTo(mapRef.current);

      const updateAddress = (lng, lat) => {
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
        )
          .then((res) => res.json())
          .then((data) => {
            const address = label || data.features?.[0]?.place_name || "";
            if (onSelectLocation)
              onSelectLocation({ coordinates: [lng, lat], address });
          });
      };

      const [lng, lat] = coords;
      updateAddress(lng, lat);

      markerRef.current.on("dragend", () => {
        const { lng, lat } = markerRef.current.getLngLat();
        updateAddress(lng, lat);
      });
    }
    return () => {
      mapRef.current?.remove(); // 🧹 Cleanup
      mapRef.current = null;
    };
  }, [onSelectLocation]);
  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[300px] sm:h-[400px] rounded-md overflow-hidden border border-gray-300"
      style={{ minHeight: "300px" }}
      id="map-container"
    />
  );
};

export default MapboxAutocomplete;
