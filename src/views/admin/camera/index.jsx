import React, { useEffect, useState } from 'react';
import { Box, Text, Button, VStack, Spinner, SimpleGrid, Icon, Tooltip } from '@chakra-ui/react';
import { AiOutlineCamera } from 'react-icons/ai';
import { MdLocalTaxi, MdTwoWheeler } from 'react-icons/md';

const VehicleIcon = ({ type }) => {
  switch (type) {
    case 'truck':
      return <MdLocalTaxi size={24} color="blue.500" />;
    case 'car':
      return <MdLocalTaxi size={24} color="green.500" />;
    case 'motorcycle':
      return <MdTwoWheeler size={24} color="orange.500" />;
    default:
      return null;
  }
};

const CameraTrackingComponent = () => {
  const [cameraData, setCameraData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCameraData = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.example.com/camera-data'); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); 
      }
      const data = await response.json();
      console.log('Camera Data:', data); 
      setCameraData(data);
    } catch (error) {
      console.error('Error fetching camera data:', error);
      setError('Failed to load camera data.'); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameraData();
  }, []);

  return (
    <Box p={5} bg="gray.50" borderRadius="lg" boxShadow="lg">
      {loading ? (
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading camera data...</Text>
        </VStack>
      ) : error ? (
        <Text color="red.500">{error}</Text> // Display error message
      ) : cameraData.length > 0 ? (
        <Box>
          <Text fontSize="2xl" mb={4} fontWeight="bold" textAlign="center">Camera Tracking</Text>
          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            {cameraData.map((camera) => (
              <Box
                key={camera.id}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                bg="white"
                boxShadow="md"
                transition="0.3s"
                _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
              >
                <VStack align="start">
                  <Icon as={AiOutlineCamera} boxSize={6} color="teal.500" />
                  <Text fontWeight="bold" color="blue.800">Camera ID: {camera.id}</Text>
                  <Text color="gray.600">Location: {camera.location}</Text>
                  <Text color={camera.status === 'active' ? 'green.500' : 'red.500'}>
                    Status: {camera.status}
                  </Text>
                  <Text>Vehicle Type: <VehicleIcon type={camera.vehicleType} /></Text>
                  <Tooltip label="View live feed from this camera" aria-label="A tooltip">
                    <Button colorScheme="blue" onClick={() => alert(`Viewing camera ${camera.id}`)}>
                      View Feed
                    </Button>
                  </Tooltip>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      ) : (
        <Text>No camera data available.</Text>
      )}
    </Box>
  );
};

export default CameraTrackingComponent;
