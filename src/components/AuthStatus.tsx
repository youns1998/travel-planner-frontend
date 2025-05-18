import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';

interface User {
  email: string;
  nickname: string;
}

const AuthStatus: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    window.location.reload();
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    axios
      .get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  if (user) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2">👤 {user.nickname}</Typography>
        <Button onClick={logout} size="small" color="error">
          로그아웃
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        onClick={() => (window.location.href = 'http://localhost:8080/oauth2/authorization/google')}
        variant="contained"
        size="small"
        sx={{ mr: 1 }}
      >
        구글 로그인
      </Button>
      <Button
        onClick={() => (window.location.href = 'http://localhost:8080/oauth2/authorization/kakao')}
        variant="contained"
        size="small"
        color="warning"
      >
        카카오 로그인
      </Button>
    </Box>
  );
  
};

export default AuthStatus;
