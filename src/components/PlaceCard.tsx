// src/components/PlaceCard.tsx
import React from 'react';
import { Place } from '../services/PlaceService';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        display: 'flex',
        mb: 2,
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: '#fafafa',
        border: '1px solid #ddd',
        borderRadius: 2,
        boxShadow: 0,
        '&:hover': {
          boxShadow: onClick ? 2 : 0,
        },
      }}
    >
      {place.firstimage ? (
        <CardMedia
          component="img"
          image={place.firstimage}
          alt={place.title}
          sx={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 1, m: 1 }}
        />
      ) : (
        <Box
          sx={{
            width: 120,
            height: 90,
            backgroundColor: '#ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            borderRadius: 1,
            m: 1,
          }}
        >
          이미지 없음
        </Box>
      )}

      <CardContent sx={{ padding: 1.5, flex: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom noWrap>
          {place.title}
        </Typography>
        <Typography variant="body2" color="text.primary" noWrap>
          {place.addr1}
        </Typography>
        {place.addr2 && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {place.addr2}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
