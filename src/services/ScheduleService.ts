// src/services/ScheduleService.ts
import axios from 'axios';
import { ScheduleDto } from '../types/schedule';

const BASE_URL = '/api/schedules';

export const getSchedules = async (): Promise<ScheduleDto[]> => {
  const token = localStorage.getItem('accessToken');
  const res = await axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const saveSchedules = async (schedules: ScheduleDto[]): Promise<void> => {
  const token = localStorage.getItem('accessToken');
  await axios.post(BASE_URL, schedules, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
