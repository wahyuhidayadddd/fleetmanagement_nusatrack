import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Text,
  Button,
  VStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Badge,
  Input,
  Flex,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { AiOutlineCamera } from 'react-icons/ai';

const CameraTrackingComponent = () => {
  const videoRef = useRef(null);
  const [cameraData, setCameraData] = useState([
    { id: 'CAM123456789', name: 'Camera 1', status: 'Active', features: ['Real-Time Tracking', 'Zoom In/Out', 'Night Vision'], company: 'Company A', username: 'user1' },
    { id: 'CAM987654321', name: 'Camera 2', status: 'Inactive', features: ['Real-Time Tracking', 'Motion Detection'], company: 'Company B', username: 'user2' },
    { id: 'CAM456789123', name: 'Camera 3', status: 'Active', features: ['Real-Time Tracking', 'Audio Detection', 'High Definition'], company: 'Company C', username: 'user3' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCamera, setNewCamera] = useState({ id: '', name: '', status: 'Active', features: [], company: '', username: '' });
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const toast = useToast();

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleAddCamera = () => {
    if (newCamera.id && newCamera.name && newCamera.company && newCamera.username) {
      setCameraData([
        ...cameraData,
        { ...newCamera, id: `CAM${Math.floor(Math.random() * 1000000000)}` },
      ]);
      setNewCamera({ id: '', name: '', status: 'Active', features: [], company: '', username: '' });
      toast({
        title: 'Camera Added',
        description: `Camera ${newCamera.name} has been added successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Missing Information',
        description: 'Please provide all necessary camera details.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteCamera = (cameraId) => {
    setCameraData(cameraData.filter(camera => camera.id !== cameraId));
    toast({
      title: 'Camera Deleted',
      description: `Camera with ID ${cameraId} has been deleted.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const openCameraDetails = (camera) => {
    setSelectedCamera(camera);
    setIsModalOpen(true);
  };

  const openEditModal = (camera) => {
    setSelectedCamera(camera);
    setIsEditModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const closeEditModal = () => setIsEditModalOpen(false);

  const handleEditCamera = () => {
    setCameraData(cameraData.map(camera => camera.id === selectedCamera.id ? selectedCamera : camera));
    setIsEditModalOpen(false);
    toast({
      title: 'Camera Updated',
      description: `Camera ${selectedCamera.name} has been updated.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
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
    <Flex p={5} bg="gray.50" borderRadius="lg" boxShadow="lg">
  
      <Box w="40%" textAlign="center" mr={10}>
        <Icon as={AiOutlineCamera} boxSize={12} color="teal.500" />
        <Text fontSize="3xl" fontWeight="bold" color="blue.800">
          Live Camera Tracking
        </Text>
        <Text fontSize="lg" color="gray.600">
          Monitoring in Real-Time
        </Text>

        <Box
          borderWidth="2px"
          borderColor="teal.500"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
          mb={4}
          mt={6}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Box>

        <Box mb={6}>
          <HStack spacing={4} mb={4}>
            <Input
              placeholder="Search Camera by ID"
              value={searchTerm}
              onChange={handleSearchChange}
              width="50%"
              bg="white"
              boxShadow="sm"
            />
            <Button
              colorScheme="teal"
              size="md"
              onClick={handleAddCamera}
              bg="blue.500"
              _hover={{ bg: 'blue.600' }}
            >
              Tambah ID Camera
            </Button>
          </HStack>
        </Box>
      </Box>

      <Box w="60%" style={{marginTop: 130}}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID Kamera</Th>
              <Th>Nama Kamera</Th>
              <Th>Status</Th>
              <Th>Fitur</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {cameraData
              .filter(camera => camera.id.includes(searchTerm))
              .map((camera) => (
                <Tr key={camera.id}>
                  <Td>{camera.id}</Td>
                  <Td>{camera.name}</Td>
                  <Td>
                    <Badge colorScheme={camera.status === 'Active' ? 'green' : 'red'}>
                      {camera.status}
                    </Badge>
                  </Td>
                  <Td>{camera.features.join(', ')}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => openCameraDetails(camera)}
                      >
                        View
                      </Button>
                      <Button
                        colorScheme="yellow"
                        size="sm"
                        onClick={() => openEditModal(camera)}
                      >
                        Edit
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDeleteCamera(camera.id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>

      {/* Camera Details Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Camera Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCamera && (
              <>
                <Text fontSize="lg" fontWeight="bold">Camera ID: {selectedCamera.id}</Text>
                <Text fontSize="md">Name: {selectedCamera.name}</Text>
                <Text fontSize="md">
                  Status: <Badge colorScheme={selectedCamera.status === 'Active' ? 'green' : 'red'}>
                    {selectedCamera.status}
                  </Badge>
                </Text>
                <Text fontSize="md">Features: {selectedCamera.features.join(', ')}</Text>
                <Text fontSize="md">Company: {selectedCamera.company}</Text>
                <Text fontSize="md">Username: {selectedCamera.username}</Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Camera Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Camera</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCamera && (
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={selectedCamera.name}
                  onChange={(e) => setSelectedCamera({ ...selectedCamera, name: e.target.value })}
                />
                <FormLabel>Status</FormLabel>
                <Input
                  value={selectedCamera.status}
                  onChange={(e) => setSelectedCamera({ ...selectedCamera, status: e.target.value })}
                />
                <FormLabel>Features</FormLabel>
                <Input
                  value={selectedCamera.features.join(', ')}
                  onChange={(e) => setSelectedCamera({ ...selectedCamera, features: e.target.value.split(',') })}
                />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEditCamera}>Save</Button>
            <Button colorScheme="gray" onClick={closeEditModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default CameraTrackingComponent;
