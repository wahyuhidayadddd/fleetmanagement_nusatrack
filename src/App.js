import './assets/css/App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme'; 
import { useState, useEffect } from 'react';
import Login from './views/auth/Login'; 

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  
  const navigate = useNavigate(); 

  const handleLogin = (username) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true'); 
    console.log('User logged in:', username);

  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    console.log('User logged out');
    navigate('/');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/'); 
    }
  }, [isAuthenticated, navigate]);

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="/login" element={<AuthLayout />} />
        <Route
          path="/admin/*"
          element={
            isAuthenticated ? (
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/rtl/*"
          element={<RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />}
        />

        <Route path="/" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </ChakraProvider>

    
  );
}
