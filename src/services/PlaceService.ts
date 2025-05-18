// ✅ 관광지 검색 API를 호출하는 서비스 파일
import axios from 'axios';

export interface Place {
  title: string;
  addr1: string;
  addr2?: string;
  mapx: string;  // 경도 (x)
  mapy: string;  // 위도 (y)
  firstimage?: string;
}

const PlaceService = {
  async searchPlaces(keyword: string): Promise<Place[]> {
    const response = await axios.get('/api/places/search', {
      params: { keyword },
    });

    // 백엔드에서 JSON 문자열이 넘어오기 때문에 파싱
    const parsed = JSON.parse(response.data);
    const items: Place[] = parsed.response?.body?.items?.item ?? [];

    return items;
  }
};

export default PlaceService;
