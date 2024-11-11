import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, SimpleGrid, Card, CardBody, Stack, Button, Icon } from '@chakra-ui/react';
import './styles.css'; 
import { Link } from 'react-router-dom';


const MainDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [features, setFeatures] = useState([]); 

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

  return (
    <Box padding="20px" bg="gray.50" minHeight="100vh">
      <Heading  style={{marginTop:100}} as="h2" size="lg" mb={6} textAlign="center">Dashboard Utama</Heading>
      <Text fontSize="lg" mb={8} textAlign="center" className="animate-slide-in">
  Selamat datang, {userData ? userData.username : 'Pengguna'}!
</Text>

  
      <Box mb={6}>
      
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
  {features.map(feature => (
    <Card key={feature.id}>
      <CardBody>
        <Stack spacing={3} align="center">
          <Text fontWeight="bold">{feature.name}</Text>
          <img src={feature.icon} style={{ width: '100px', height: '100px' }} />
          <Link to={`/detail/${feature.features}`}>
            <Button colorScheme="teal" variant="outline">Lihat Detail</Button>
          </Link>
        </Stack>
      </CardBody>
    </Card>
  ))}
</SimpleGrid>
      </Box>

  
    </Box>
  );
};

export default MainDashboard;