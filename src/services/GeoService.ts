// src/services/GeoService.ts
import axios from 'axios';

const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
const MIN_INTERVAL_MS = 1500; // 최소 호출 간격 (1.5초)
let lastRequestTime = 0;

// ✅ 주소 → 좌표 캐시
const addressCache: Record<string, { x: number; y: number }> = {};

/**
 * 주소를 좌표로 변환 (카카오 REST API 사용, 요청 간격 제한 + 캐싱)
 */
export const convertAddressToCoords = async (
  address: string
): Promise<{ x: number; y: number }> => {
  if (!address.trim()) {
    throw new Error('주소가 비어 있습니다.');
  }

  // ✅ 캐시된 값이 있으면 반환
  if (addressCache[address]) {
    return addressCache[address];
  }

  const now = Date.now();
  if (now - lastRequestTime < MIN_INTERVAL_MS) {
    throw new Error('⏱️ 너무 빠르게 요청했습니다. 잠시 후 다시 시도해주세요.');
  }
  lastRequestTime = now;

  try {
    const res = await axios.get(
      'https://dapi.kakao.com/v2/local/search/address.json',
      {
        params: { query: address },
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      }
    );

    const documents = res.data.documents;
    if (!documents || documents.length === 0) {
      throw new Error('📭 주소 검색 결과 없음');
    }

    const { x, y } = documents[0];
    const coords = { x: parseFloat(x), y: parseFloat(y) };

    // ✅ 캐시에 저장
    addressCache[address] = coords;

    return coords;
  } catch (err) {
    console.error('❌ 좌표 변환 API 실패:', err);
    throw new Error('📭 주소 검색 결과 없음');
  }
};
