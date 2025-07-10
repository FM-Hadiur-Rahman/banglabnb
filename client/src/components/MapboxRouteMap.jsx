import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { reverseGeocode } from "../utils/reverseGeocode";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapboxRouteMap = ({
  fromLocation,
  toLocation,
  onSetFrom,
  onSetTo,
  onSetFromText,
  onSetToText,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState({ from: null, to: null });
  const [clickStage, setClickStage] = useState(1); // 1 = setFrom, 2 = setTo

  useEffect(() => {
    if (mapRef.current) return; // prevent reinitialization

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [90.4125, 23.8103],
      zoom: 6,
    });

    map.addControl(new mapboxgl.NavigationControl());
    mapRef.current = map;

    const handleClick = async (e) => {
      const lngLat = [e.lngLat.lng, e.lngLat.lat];
      const address = await reverseGeocode(lngLat);

      if (clickStage === 1) {
        addMarker("from", lngLat, address);
        onSetFrom?.({ type: "Point", coordinates: lngLat, address });
        onSetFromText?.(address);
        setClickStage(2);
      } else {
        addMarker("to", lngLat, address);
        onSetTo?.({ type: "Point", coordinates: lngLat, address });
        onSetToText?.(address);
        setClickStage(1);
      }
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
      map.remove();
      mapRef.current = null;
    };
  }, [clickStage, onSetFrom, onSetTo, onSetFromText, onSetToText]);

  const addMarker = (type, coordinates, label = "") => {
    if (markers[type]) markers[type].remove();

    const el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundColor = type === "from" ? "green" : "red";
    el.style.width = "12px";
    el.style.height = "12px";
    el.style.borderRadius = "50%";

    const popup = new mapboxgl.Popup({ offset: 25 }).setText(label);

    const marker = new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .setPopup(popup)
      .addTo(mapRef.current);

    setMarkers((prev) => ({ ...prev, [type]: marker }));
  };

  const drawRoute = async () => {
    if (!fromLocation || !toLocation) return;

    try {
      const res = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLocation.coordinates.join(
          ","
        )};${toLocation.coordinates.join(
          ","
        )}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const data = await res.json();
      const route = data.routes?.[0]?.geometry;
      if (!route) return;

      if (mapRef.current.getSource("route")) {
        mapRef.current.getSource("route").setData(route);
      } else {
        mapRef.current.addSource("route", {
          type: "geojson",
          data: route,
        });

        mapRef.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 4,
            "line-opacity": 0.8,
          },
        });
      }
    } catch (err) {
      console.error("❌ Route drawing failed:", err);
    }
  };

  useEffect(() => {
    if (fromLocation)
      addMarker("from", fromLocation.coordinates, fromLocation.address);
    if (toLocation) addMarker("to", toLocation.coordinates, toLocation.address);
    if (fromLocation && toLocation) drawRoute();
  }, [fromLocation, toLocation]);

  const resetMap = () => {
    markers.from?.remove();
    markers.to?.remove();
    setMarkers({ from: null, to: null });

    if (mapRef.current.getLayer("route")) {
      mapRef.current.removeLayer("route");
      mapRef.current.removeSource("route");
    }

    onSetFrom?.(null);
    onSetTo?.(null);
    onSetFromText?.("");
    onSetToText?.("");
    setClickStage(1);
  };

  return (
    <div className="relative">
      <div ref={mapContainerRef} className="h-64 rounded border" />
      <button
        type="button"
        onClick={resetMap}
        className="absolute top-2 right-2 bg-white border text-sm px-2 py-1 rounded shadow"
      >
        🔄 Reset
      </button>
    </div>
  );
};

export default MapboxRouteMap;
