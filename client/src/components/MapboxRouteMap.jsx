// === MapboxRouteMap.jsx ===
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapboxRouteMap = ({ fromLocation, toLocation }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!fromLocation || !toLocation) return;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: fromLocation.coordinates,
      zoom: 6,
    });

    new mapboxgl.Marker({ color: "green" })
      .setLngLat(fromLocation.coordinates)
      .addTo(map);

    new mapboxgl.Marker({ color: "red" })
      .setLngLat(toLocation.coordinates)
      .addTo(map);

    const getRoute = async () => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLocation.coordinates.join(
        ","
      )};${toLocation.coordinates.join(",")}?geometries=geojson&access_token=${
        mapboxgl.accessToken
      }`;
      const res = await fetch(url);
      const data = await res.json();
      const route = data.routes[0].geometry;

      map.on("load", () => {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: route,
          },
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#0074D9",
            "line-width": 5,
          },
        });
      });
    };

    getRoute();

    return () => map.remove();
  }, [fromLocation, toLocation]);

  return <div ref={mapRef} className="h-64 w-full rounded border mt-4" />;
};

export default MapboxRouteMap;
