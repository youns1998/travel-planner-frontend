export interface ScheduleDto {
  title: string;
  mapx: number;
  mapy: number;
  order: number;
  description?: string;
  imgUrl?: string;
  address?: string; // ✅ 이거 추가!
}
