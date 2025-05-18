import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import AuthStatus from './AuthStatus';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* 좌측: 로고 */}
        <Typography
          variant="h6"
          component="a"
          href="/"
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          ✈️ Travel Planner
        </Typography>

        {/* 우측: 로그인 상태 */}
        <Box>
          <AuthStatus />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
