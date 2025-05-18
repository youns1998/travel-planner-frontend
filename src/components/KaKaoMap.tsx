import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { Place } from '../services/PlaceService';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  places: Place[];
  selectedPlace?: Place | null;
  schedule?: Place[];
  vertexes?: number[][];
  routeInfo?: { distance: number; duration: number } | null;
  startCoords?: { x: number; y: number } | null;
}

const KakaoMap: React.FC<KakaoMapProps> = ({
  places,
  selectedPlace,
  schedule = [],
  vertexes = [],
  routeInfo,
  startCoords,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const polylineRef = useRef<any>(null);
  const scheduleMarkerRefs = useRef<any[]>([]);
  const labelOverlayRefs = useRef<any[]>([]);
  const startMarkerRef = useRef<any>(null);

  // ✅ SDK 동적 로딩
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      initializeMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_JS_KEY}&autoload=false&libraries=services`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => {
          initializeMap();
        });
      };
      document.head.appendChild(script);
    }
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) return;
    const center = new window.kakao.maps.LatLng(37.5665, 126.9780);
    const createdMap = new window.kakao.maps.Map(mapRef.current, {
      center,
      level: 5,
    });
    setMap(createdMap);
  };

  useEffect(() => {
    if (!map || !selectedPlace) return;
    const lat = parseFloat(selectedPlace.mapy);
    const lng = parseFloat(selectedPlace.mapx);
    if (!isNaN(lat) && !isNaN(lng)) {
      const center = new window.kakao.maps.LatLng(lat, lng);
      map.panTo(center);
    }
  }, [map, selectedPlace]);

  useEffect(() => {
    if (!map) return;

    if (startMarkerRef.current) {
      startMarkerRef.current.setMap(null);
    }

    if (startCoords) {
      const position = new window.kakao.maps.LatLng(startCoords.y, startCoords.x);
      const marker = new window.kakao.maps.Marker({
        map,
        position,
        image: new window.kakao.maps.MarkerImage(
          'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
          new window.kakao.maps.Size(24, 35)
        ),
        title: '출발지',
      });
      startMarkerRef.current = marker;
    }
  }, [map, startCoords]);

  useEffect(() => {
    if (!map) return;

    if (polylineRef.current) polylineRef.current.setMap(null);
    scheduleMarkerRefs.current.forEach((m) => m.setMap(null));
    labelOverlayRefs.current.forEach((o) => o.setMap(null));
    scheduleMarkerRefs.current = [];
    labelOverlayRefs.current = [];

    if (vertexes.length === 0 || schedule.length === 0) return;

    const linePath = vertexes.map(([x, y]) => new window.kakao.maps.LatLng(y, x));
    const polyline = new window.kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 4,
      strokeColor: '#FF5A5F',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });
    polyline.setMap(map);
    polylineRef.current = polyline;

    schedule.forEach((place, idx) => {
      const lat = parseFloat(place.mapy);
      const lng = parseFloat(place.mapx);
      const position = new window.kakao.maps.LatLng(lat, lng);

      const marker = new window.kakao.maps.Marker({ map, position });
      scheduleMarkerRefs.current.push(marker);

      const isStart = idx === 0;
      const isEnd = idx === schedule.length - 1;
      const prefix = isStart ? '출발지/' : isEnd ? '도착지/' : '';
      const content = `
        <div style="
          transform: translateY(-130%);
          background: rgba(255,255,255,0.95);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 12px;
          font-weight: bold;
          color: #333;
          white-space: nowrap;
          user-select: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        ">
          ${prefix}${place.title}
        </div>
      `;

      const labelOverlay = new window.kakao.maps.CustomOverlay({
        content,
        position,
        yAnchor: 0,
        zIndex: 3,
      });

      labelOverlay.setMap(map);
      labelOverlayRefs.current.push(labelOverlay);
    });

    const bounds = new window.kakao.maps.LatLngBounds();
    linePath.forEach((latlng) => bounds.extend(latlng));
    map.setBounds(bounds);
  }, [map, schedule, vertexes]);

  return (
    <Box
      ref={mapRef}
      sx={{
        width: '100%',
        height: 500,
        borderRadius: 2,
        border: '1px solid #ddd',
        overflow: 'hidden',
      }}
    />
  );
};

export default KakaoMap;
