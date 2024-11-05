import React, { useEffect, useRef } from 'react';
import { Box, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { AiOutlineCamera } from 'react-icons/ai';

const CameraTrackingComponent = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Box p={5} bg="gray.50" borderRadius="lg" boxShadow="lg" textAlign="center">
      <VStack spacing={4}>
        <Icon as={AiOutlineCamera} boxSize={12} color="teal.500" />
        <Text fontSize="3xl" fontWeight="bold" color="blue.800">
          Live Camera Tracking
        </Text>
        <Text fontSize="lg" color="gray.600">
          Monitoring in Real-Time
        </Text>
      </VStack>
      <Box
        borderWidth="2px"
        borderColor="teal.500"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        mb={4}
        mt={6}
        transition="0.3s"
        _hover={{ boxShadow: 'xl', transform: 'scale(1.02)' }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', borderRadius: '8px' }}
        />
      </Box>
      <Button colorScheme="teal" size="lg" mt={4} onClick={() => alert('Tracking started!')}>
        Start Tracking
      </Button>
    </Box>
  );
};

export default CameraTrackingComponent;
