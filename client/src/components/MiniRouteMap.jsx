import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MiniRouteMap = ({ from, to, pickup }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null); // needed for cleanup

  useEffect(() => {
    if (!from?.coordinates || !to?.coordinates) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: from.coordinates,
      zoom: 7,
      interactive: true,
    });

    mapRef.current = map;

    // Function to add a labeled marker
    const createMarker = (coords, label, color = "#3b82f6") => {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundColor = color;
      el.style.width = "12px";
      el.style.height = "12px";
      el.style.borderRadius = "50%";

      const popup = new mapboxgl.Popup({ offset: 25 }).setText(label);

      new mapboxgl.Marker(el).setLngLat(coords).setPopup(popup).addTo(map);
    };

    createMarker(from.coordinates, `🅰️ From: ${from.name}`, "#10b981");
    createMarker(to.coordinates, `🅱️ To: ${to.name}`, "#ef4444");

    if (pickup?.coordinates) {
      createMarker(pickup.coordinates, `📦 Pickup: ${pickup.name}`, "#facc15");
    }

    // Build route coordinates
    const routeCoordinates = [from.coordinates];
    if (pickup?.coordinates) routeCoordinates.push(pickup.coordinates);
    routeCoordinates.push(to.coordinates);

    const routeGeoJSON = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: routeCoordinates,
      },
    };

    map.on("load", () => {
      // Add route line
      map.addSource("route", {
        type: "geojson",
        data: routeGeoJSON,
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
          "line-opacity": 0.8,
        },
      });

      // Set map bounds
      const bounds = new mapboxgl.LngLatBounds();
      routeCoordinates.forEach((coord) => bounds.extend(coord));

      map.fitBounds(bounds, {
        padding: 40,
        maxZoom: 12,
        duration: 1000,
      });
    });

    return () => map.remove();
  }, [from, to, pickup]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-32 rounded-t overflow-hidden"
      style={{ minHeight: "120px" }}
    />
  );
};

export default MiniRouteMap;
