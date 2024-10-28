import React, { useState, useEffect } from 'react';
import {
  Flex,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Switch,
  useColorMode,
  useColorModeValue,
  Text,
  Box,
  Select,
} from '@chakra-ui/react';
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import backgroundImage from 'assets/gps-light.webp'; 

const Login = ({ onLogin }) => {
  const { toggleColorMode } = useColorMode();
  const formBackground = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(30, 30, 30, 0.9)'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };



  const handleLogin = async (e) => {
    e.preventDefault();
  
 
    setErrorMessages({ username: '', password: '' });
  
    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Input diperlukan',
        text: 'Silakan masukkan username dan password',
        confirmButtonText: 'Okay'
      });
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Login berhasil:', data);
     
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));  
        onLogin(data.user.username); 
        navigate('/admin/main-dashboard'); 
      }
      else {
        const errorData = await response.json();
        console.error('Login gagal:', errorData.error);

        if (errorData.error.includes('username')) {
          setErrorMessages((prev) => ({ ...prev, username: 'Username tidak valid' }));
        } else if (errorData.error.includes('password')) {
          setErrorMessages((prev) => ({ ...prev, password: 'Password tidak valid' }));
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Gagal',
            text: 'Silakan coba login kembali',
            confirmButtonText: 'Coba Lagi'
          });
        }
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Terjadi kesalahan saat login. Silakan coba lagi.',
        confirmButtonText: 'Okay'
      });
    }
  };
  
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      onLogin(userData.user.username); 
    }
  }, [onLogin]);
  
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <Flex
      h="100vh"
      alignItems="center"
      justifyContent="center"
      backgroundImage={`url(${backgroundImage})`} 
      backgroundSize="cover"
      backgroundPosition="center"
      position="relative"
      transition="all 0.3s ease" 
      _hover={{ filter: 'brightness(0.7)' }} 
    >
      <Box
        bg={formBackground}
        p={12}
        borderRadius={8}
        boxShadow="lg"
        width={{ base: "90%", md: "400px" }}
        position="relative"
        zIndex={1}
      >
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          {t('welcome')}
        </Heading>
        {/* <Flex justifyContent="space-between" mt={4} px={4}>
          <Button
            colorScheme="blue"
            width="48%"
            mb={2}
            borderRadius="md"
            _hover={{ bg: "blue.600" }}
            _active={{ bg: "blue.700" }}
            onClick={handleAdminClick}
          >
            Admin
          </Button>
          <Button
            colorScheme="yellow"
            width="48%"
            mb={2}
            borderRadius="md"
            _hover={{ bg: "yellow.400" }}
            _active={{ bg: "yellow.500" }}
            onClick={handleRegisterClick}
          >
            Register
          </Button>
        </Flex> */}

        <form onSubmit={handleLogin}>
          <FormControl mb={4}>
            <FormLabel htmlFor="username">{t('username')}</FormLabel>
            <Input
              id="username"
              placeholder={t('username')}
              type="text"
              variant="filled"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errorMessages.username && (
              <Text color="red.500" fontSize="sm">{errorMessages.username}</Text>
            )}
          </FormControl>
          <FormControl mb={6}>
            <FormLabel htmlFor="password">{t('password')}</FormLabel>
            <Input
              id="password"
              placeholder={t('password')}
              type="password"
              variant="filled"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessages.password && (
              <Text color="red.500" fontSize="sm">{errorMessages.password}</Text>
            )}
          </FormControl>
          <Button colorScheme="teal" mb={6} type="submit" width="full">
            {t('login')}
          </Button>
        </form>
        <FormControl display="flex" alignItems="center" justifyContent="center">
          <FormLabel htmlFor="dark_mode" mb="0">
            {t('enableDarkMode')}
          </FormLabel>
          <Switch
            id="dark_mode"
            colorScheme="teal"
            size="lg"
            onChange={toggleColorMode}
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel htmlFor="language">Language</FormLabel>
          <Select id="language" onChange={handleLanguageChange} placeholder="Select language">
            <option value="en">English</option>
            <option value="id">Bahasa Indonesia</option>
            <option value="ja">日本語 (Japanese)</option>
            <option value="zh">中文 (Chinese)</option>
          </Select>
        </FormControl>

        {/* <Text textAlign="center" mb={4} fontSize="sm" color="teal.500">
          <Button variant="link" color="teal.500">
            {t('forgotUsernameOrPassword')}
          </Button>
        </Text> */}
      </Box>

      <Box
        position="absolute"
        bottom={4}
        left={0}
        right={0}
        textAlign="center"
        color="white"
        opacity={100}
        fontSize="sm"
        zIndex={0}
      >
        {t('poweredBy')}
      </Box>
    </Flex>
  );
};

export default Login;
