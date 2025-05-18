// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TravelPlannerPage from './pages/TravelPlannerPage';
import OAuthRedirect from './pages/OAuthRedirect';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<TravelPlannerPage />} />
        <Route path="/oauth2/redirect" element={<OAuthRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
