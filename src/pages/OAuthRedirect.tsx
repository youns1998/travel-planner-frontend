import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    if (token) {
      localStorage.setItem('accessToken', token);
    }
    navigate('/'); // 로그인 후 홈으로 이동
  }, []);

  return <div>🔐 로그인 처리 중입니다...</div>;
};

export default OAuthRedirect;
