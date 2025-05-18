import axios from 'axios';

export interface OriginDto {
  address: string;
  x: number;
  y: number;
}

export const saveOrigin = async (dto: OriginDto) => {
  await axios.post('/users/origin', dto, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
};

export const getOrigin = async (): Promise<OriginDto> => {
  const res = await axios.get('/users/origin', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  return res.data;
};
