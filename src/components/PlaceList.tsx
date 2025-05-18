// src/components/PlaceList.tsx
import React from 'react';
import { Place } from '../services/PlaceService';
import PlaceCard from './PlaceCard';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PlaceListProps {
  places: Place[];
  onPlaceClick?: (place: Place) => void;
  renderAddButton?: (place: Place) => React.ReactNode;
}

const PlaceList: React.FC<PlaceListProps> = ({ places, onPlaceClick, renderAddButton }) => {
  if (!places || places.length === 0) {
    return (
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        🔍 검색 결과가 없습니다.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {places.map((place, idx) => (
        <Box key={`${place.title}-${idx}`} sx={{ mb: 2 }}>
          <PlaceCard place={place} onClick={() => onPlaceClick?.(place)} />
          {renderAddButton && <Box sx={{ mt: 1 }}>{renderAddButton(place)}</Box>}
        </Box>
      ))}
    </Box>
  );
};

export default PlaceList;
