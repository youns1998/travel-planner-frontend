// src/components/MarkerManager.tsx
import React, { useEffect } from 'react';
import { Place } from '../services/PlaceService';

interface MarkerManagerProps {
  map: any;
  places: Place[];
}

const MarkerManager: React.FC<MarkerManagerProps> = ({ map, places }) => {
  useEffect(() => {
    if (!map || !window.kakao) return;

    const markers: any[] = [];

    places.forEach((place) => {
      const lat = parseFloat(place.mapy);
      const lng = parseFloat(place.mapx);

      if (!isNaN(lat) && !isNaN(lng)) {
        const position = new window.kakao.maps.LatLng(lat, lng);

        const marker = new window.kakao.maps.Marker({
          position,
          map,
          title: place.title,
        });

        // ✅ 스타일 분리
        const infoContent = `
          <div style="
            padding: 6px 10px;
            font-size: 13px;
            font-family: 'Roboto', sans-serif;
            background: white;
            border-radius: 4px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          ">
            ${place.title}
          </div>
        `;

        const infowindow = new window.kakao.maps.InfoWindow({
          content: infoContent,
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          infowindow.open(map, marker);
        });

        markers.push(marker);
      }
    });

    return () => {
      markers.forEach((marker) => marker.setMap(null));
    };
  }, [map, places]);

  return null;
};

export default MarkerManager;
