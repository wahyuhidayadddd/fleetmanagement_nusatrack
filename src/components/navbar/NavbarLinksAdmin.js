// Chakra Imports
import {
  Avatar,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  Checkbox,
  FormLabel,
  Input,
  VStack,
  Box,
  Select,
  Heading,
  Stack,
} from '@chakra-ui/react';


import { SidebarResponsive } from 'components/sidebar/Sidebar';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import routes from 'routes';
import { ChevronDownIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function HeaderLinks(props) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const navbarIcon = useColorModeValue('gray.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.700', 'brand.400');
  const ethColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const ethBox = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    sessionStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    window.location.href = '/';
  };
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', selected_features: [] });
  const [features, setFeatures] = useState([]);
  const [devices, setDevices] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
       
        const devicesResponse = await fetch('http://localhost:5000/api/dataperangkatalat', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!devicesResponse.ok) {
          throw new Error('Failed to fetch devices');
        }

        const devicesTextResponse = await devicesResponse.text();
        console.log('Raw devices response:', devicesTextResponse);
        const devicesData = JSON.parse(devicesTextResponse);
        setDevices(devicesData);

    
        // const userResponse = await fetch("http://localhost:5000/api/lihatdata", {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${token}`,
        //   },
        // });

        // if (userResponse.ok) {
        //   const userData = await userResponse.json();
        //   if (userData) {
        //     if (userData.user) {
        //       setUserData(userData.user);
        //     }
        //     if (userData.features) {
        //       setFeatures(userData.features);
        //     }
        //   }
        // }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

 

  const lihatDataUser = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch("http://localhost:5000/api/lihatdata", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
      },
      
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log(data);

      if (data && data.user) {
        console.log('ID Pengguna:', data.user.id);
        setUserData(data.user); 
        setFeatures(data.features);
      } else {
        console.log('Data tidak memiliki ID atau tidak terdefinisi:', data);
      }
    } else {
      console.log('Gagal mengambil data pengguna');
    }
  };
  
  useEffect(() => {
    lihatDataUser(); 
  }, []); 



  const handleFeatureChange = (featureId) => {
    setNewUser(prevUser => {
      const selectedFeatures = prevUser.selected_features.includes(featureId)
        ? prevUser.selected_features.filter(id => id !== featureId)
        : [...prevUser.selected_features, featureId];
      return { ...prevUser, selected_features: selectedFeatures };
    });
  };
  const handleRegister = async () => {
    const token = localStorage.getItem('token');
  
    const response = await fetch("http://localhost:5000/api/register", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
  
    if (response.ok) {
      console.log('Registration successful');
  
      
      Swal.fire({
        title: 'Success!',
        text: 'Akun berhasil ditambahkan!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
  
      
      setIsModalOpen(false);
  
      
      setNewUser({ 
        username: '', 
        password: '', 
        email: '', 
        company_name: '', 
      
        selected_features: [],
  
     
        purchase_date: '', 
        address: '' 
      });
      
    } else {
      console.error('Registration failed');
  
     
      Swal.fire({
        title: 'Error!',
        text: 'Pendaftaran gagal. Silakan coba lagi.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };


  
  
  return (
    <>
    
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <SidebarResponsive routes={routes} />
      <Menu>
        <MenuButton>
          <Avatar
            _hover={{ cursor: 'pointer' }}
            color="white"
            name={userData ? userData.username : 'Pengguna'}
            bg="#11047A"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>

        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              👋&nbsp; Hey, {userData ? userData.username : 'Pengguna'}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">

  {userData && userData.role === 'admin' && (
    <MenuItem
      _hover={{ bg: 'none' }}
      _focus={{ bg: 'none' }}
      borderRadius="8px"
      px="14px"
      onClick={() => setIsModalOpen(true)}
    >
      <Text fontSize="sm">Tambah Akun Perusahaan  </Text>
    </MenuItem>
  )}
  <MenuItem
    _hover={{ bg: 'none' }}
    _focus={{ bg: 'none' }}
    color="red.400"
    borderRadius="8px"
    px="14px"
    onClick={handleLogout}
  >
    <Text fontSize="sm">Keluar</Text>
  </MenuItem>
</Flex>

        </MenuList>
      </Menu>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
      <ModalOverlay />
      <ModalContent>
      <ModalHeader fontSize="xl" fontWeight="bold" color="teal.600" textAlign="center">
  Daftar Akun Perusahaan
</ModalHeader>

        <ModalBody>
          <VStack spacing={4} align="stretch"> 
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                placeholder="Enter your username"
                variant="outline" 
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Enter your password"
                variant="outline"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email" 
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter your email"
                variant="outline"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Nama Perusahaan</FormLabel>
              <Input
                value={newUser.company_name}
                onChange={(e) => setNewUser({ ...newUser, company_name: e.target.value })}
                placeholder="Enter company name"
                variant="outline"
              />
            </FormControl>

            <FormControl>

            <Box>
  
      <FormLabel>Fitur yang Dipilih</FormLabel>
      
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Pilih Fitur
        </MenuButton>
        <MenuList>
          {features.map((feature) => (
            <MenuItem key={feature.id}>
              <Checkbox
                isChecked={newUser.selected_features.includes(feature.id)}
                onChange={() => handleFeatureChange(feature.id)}
              >
                {feature.name}
              </Checkbox>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      <Box mt={4}>
        <strong>Fitur Terpilih:</strong>
        <ul>
          {newUser.selected_features.map((featureId) => {
            const feature = features.find((f) => f.id === Number(featureId));
            if (!feature) return null;

            return (
              <li key={feature.id}>
                {feature.name}
              </li>
            );
          })}
        </ul>
      </Box>



    </Box>

            </FormControl>

  
        {/* <FormControl>
          <FormLabel>Perangkat GPS</FormLabel>
          <Select
            value={newUser.gps_device_name}
            onChange={(e) => {
              const selectedDevice = devices.find(device =>
                `${device.gps_device_name} - ${device.gps_device_code}` === e.target.value
              );
              if (selectedDevice) {
                setNewUser({
                  ...newUser,
                  gps_device_name: selectedDevice.gps_device_name,
                  gps_device_code: selectedDevice.gps_device_code,
                });
              }
            }}
          >
            <option value="" disabled>
              Pilih Perangkat GPS
            </option>
            {devices.length > 0 ? (
              devices.map((device) => (
                <option key={device.idgps} value={`${device.gps_device_name} - ${device.gps_device_code}`}>
                  {device.gps_device_name} - {device.gps_device_code}
                </option>
              ))
            ) : (
              <option disabled>Tidak ada perangkat yang tersedia</option>
            )}
          </Select>
        </FormControl> */}

      

            <FormControl>
              <FormLabel>Tanggal Pembelian</FormLabel>
              <Input
                type="date"
                value={newUser.purchase_date}
                onChange={(e) => setNewUser({ ...newUser, purchase_date: e.target.value })}
                variant="outline"
              />
            </FormControl>
            {/* <FormControl>
  <FormLabel>Masa Pembelian</FormLabel>
  <Select
    value={newUser.bulan_pembelian}
    onChange={(e) => setNewUser({ ...newUser, bulan_pembelian: e.target.value })}
    placeholder="Pilih Durasi Pembelian"
    variant="outline"
  >
    <option value="1">1 Bulan</option>
    <option value="3">3 Bulan</option>
    <option value="6">6 Bulan</option>
    <option value="12">12 Bulan</option>
  </Select>
</FormControl> */}

            <FormControl>
              <FormLabel>Alamat</FormLabel>
              <Input
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                placeholder="Enter address"
                variant="outline"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleRegister}>
            Daftar
          </Button>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Keluar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </Flex>
    </>

  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
