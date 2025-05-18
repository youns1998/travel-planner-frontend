// src/components/PlaceSearch.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

interface Place {
  title: string;
  addr1: string;
  addr2?: string;
  mapx: string;
  mapy: string;
  firstimage?: string;
}

interface PlaceSearchProps {
  onPlacesSelected: (places: Place[]) => void;
}

const PlaceSearch: React.FC<PlaceSearchProps> = ({ onPlacesSelected }) => {
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');

  const searchPlaces = async () => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      setError('공백만으로는 검색할 수 없습니다.');
      return;
    }

    try {
      const response = await axios.get('/api/places/search', {
        params: { keyword: trimmed },
      });

      const items = response.data?.response?.body?.items?.item ?? [];
      onPlacesSelected(items);
      setError('');
    } catch (err) {
      console.error(err);
      setError('검색에 실패했습니다.');
    }
  };

  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      <TextField
        label="장소 검색"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') searchPlaces();
        }}
        variant="outlined"
        size="small"
      />
      <Button variant="contained" color="primary" onClick={searchPlaces}>
        검색
      </Button>
      {error && (
        <Typography color="error" variant="body2" sx={{ ml: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default PlaceSearch;
