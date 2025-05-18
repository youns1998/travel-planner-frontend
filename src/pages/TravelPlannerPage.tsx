import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  Alert,
} from '@mui/material';
import PlaceSearch from '../components/PlaceSearch';
import KakaoMap from '../components/KaKaoMap';
import PlaceList from '../components/PlaceList';
import MyScheduleList from '../components/MyScheduleList';
import { Place } from '../services/PlaceService';
import { convertAddressToCoords } from '../services/GeoService';
import { ScheduleDto } from '../types/schedule';
import { getSchedules, saveSchedules } from '../services/ScheduleService';

const STORAGE_KEY = 'my_travel_schedule';

const TravelPlannerPage: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [schedule, setSchedule] = useState<Place[]>([]);
  const [vertexes, setVertexes] = useState<number[][]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [originAddress, setOriginAddress] = useState('');
  const [startCoords, setStartCoords] = useState<{ x: number; y: number } | null>(null);
  const [coordError, setCoordError] = useState<string | null>(null);

  const toPlace = (dto: ScheduleDto): Place => ({
    title: dto.title,
    addr1: dto.address || '주소 정보 없음',
    mapx: dto.mapx.toString(),
    mapy: dto.mapy.toString(),
    firstimage: dto.imgUrl ?? '',
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setSchedule(JSON.parse(stored));
        } catch (e) {
          console.error('❌ 저장된 일정 불러오기 실패:', e);
        }
      }
      return;
    }

    getSchedules()
      .then((res) => {
        const placeList = res.map(toPlace);
        setSchedule(placeList);
        setIsLoggedIn(true);
        localStorage.removeItem(STORAGE_KEY);
      })
      .catch((err) => {
        console.error('❌ 서버 일정 불러오기 실패:', err);
        setIsLoggedIn(false);
      });
  }, []);

  useEffect(() => {
    if (schedule.length === 0) {
      localStorage.removeItem(STORAGE_KEY);

      if (isLoggedIn) {
        saveSchedules([]).catch((err) =>
          console.error('❌ 서버 일정 삭제 실패:', err)
        );
      }

      return;
    }

    if (isLoggedIn) {
      const dtoList: ScheduleDto[] = schedule.map((place, index) => ({
        title: place.title,
        mapx: parseFloat(place.mapx),
        mapy: parseFloat(place.mapy),
        order: index,
        description: '',
        imgUrl: place.firstimage || '',
        address: place.addr1 || '',
      }));
      saveSchedules(dtoList).catch((err) =>
        console.error('❌ 서버 일정 저장 실패:', err)
      );
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    }
  }, [schedule, isLoggedIn]);

  useEffect(() => {
    if (schedule.length < 2 || !startCoords) return;

    const origin = startCoords;
    const destination = {
      x: schedule[schedule.length - 1].mapx,
      y: schedule[schedule.length - 1].mapy,
    };
    const waypoints = schedule.slice(0, -1).map((p) => ({
      x: p.mapx,
      y: p.mapy,
    }));

    axios
      .post('/api/route/calc', { origin, destination, waypoints })
      .then((res) => {
        const { distance, duration, vertexes } = res.data;
        setVertexes(vertexes);
        setRouteInfo({ distance, duration });
      })
      .catch((err) => {
        console.error('❌ 경로 계산 실패:', err);
        setVertexes([]);
        setRouteInfo(null);
      });
  }, [schedule, startCoords]);

  const handleSetOrigin = async () => {
    if (!originAddress.trim()) {
      setCoordError('출발지 주소를 입력하세요.');
      setStartCoords(null);
      return;
    }

    try {
      const coord = await convertAddressToCoords(originAddress);
      setStartCoords(coord);
      setCoordError(null);
    } catch (err: any) {
      setStartCoords(null);
      setCoordError(err.message || '좌표 변환 실패');
    }
  };

  const addToSchedule = (place: Place) => {
    if (schedule.find((p) => p.title === place.title)) return;
    setSchedule((prev) => [...prev, place]);
  };

  const removeFromSchedule = (index: number) => {
    setSchedule((prev) => prev.filter((_, i) => i !== index));
  };

  const resetSchedule = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSchedule([]);
  };

  const handleOptimize = async () => {
    if (!startCoords) {
      alert('출발지 좌표를 먼저 설정해주세요.');
      return;
    }

    try {
      const res = await axios.post<ScheduleDto[]>(
        `/api/schedules/optimize?originX=${startCoords.x}&originY=${startCoords.y}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      const optimized = res.data.map(toPlace);
      setSchedule(optimized);
    } catch (err) {
      console.error('❌ 최적 경로 정렬 실패:', err);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <PlaceSearch onPlacesSelected={setPlaces} />
          <PlaceList
            places={places}
            onPlaceClick={(place) => setSelectedPlace(place)}
            renderAddButton={(place) => (
              <Button
                variant="outlined"
                size="small"
                onClick={() => addToSchedule(place)}
                sx={{ mt: 1 }}
              >
                + 일정 추가
              </Button>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <KakaoMap
            places={places}
            selectedPlace={selectedPlace}
            schedule={schedule}
            vertexes={vertexes}
            routeInfo={routeInfo}
            startCoords={startCoords}
          />
          {routeInfo && (
            <Paper sx={{ mt: 2, p: 2, bgcolor: '#f9f9f9' }}>
              <Typography variant="body2">
                <strong>📏 총 거리:</strong> {(routeInfo.distance / 1000).toFixed(2)} km
              </Typography>
              <Typography variant="body2">
                <strong>⏱️ 예상 소요 시간:</strong> {(routeInfo.duration / 60).toFixed(1)} 분
              </Typography>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="출발지 주소"
              variant="outlined"
              size="small"
              fullWidth
              value={originAddress}
              onChange={(e) => setOriginAddress(e.target.value)}
              placeholder="예: 서울특별시 종로구 세종대로 110"
            />
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
              onClick={handleSetOrigin}
            >
              📍 출발지 설정
            </Button>
            {startCoords && (
              <Typography variant="caption" color="primary">
                좌표: X={startCoords.x.toFixed(5)}, Y={startCoords.y.toFixed(5)}
              </Typography>
            )}
            {coordError && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {coordError}
              </Alert>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Button variant="contained" color="secondary" onClick={resetSchedule}>
              🧹 일정 초기화
            </Button>
            <Button variant="contained" color="primary" onClick={handleOptimize}>
              🔁 최적 경로 정렬
            </Button>
          </Box>

          <MyScheduleList
            schedule={schedule}
            setSchedule={setSchedule}
            onRemove={removeFromSchedule}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TravelPlannerPage;
