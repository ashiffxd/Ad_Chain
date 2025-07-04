import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, extendTheme, Spinner, Center } from '@chakra-ui/react';
import { useAuth } from './contexts/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import InfluencerDashboard from './pages/InfluencerDashboard.jsx';
import CompanyDashboard from './pages/CompanyDashboard.jsx';
import InfluencerProfile from './pages/InfluencerProfile.jsx';
import CompanyProfile from './pages/CompanyProfile.jsx';

const theme = extendTheme({
  colors: {
    brand: {
      500: '#FF4D4D',
    },
  },
});

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // While loading, show a spinner instead of redirecting
  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  // After loading, check if user exists
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check role after confirming user exists
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/influencer/dashboard"
            element={
              <ProtectedRoute role="influencer">
                <InfluencerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute role="company">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/influencer/profile"
            element={
              <ProtectedRoute role="influencer">
                <InfluencerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/profile"
            element={
              <ProtectedRoute role="company">
                <CompanyProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;