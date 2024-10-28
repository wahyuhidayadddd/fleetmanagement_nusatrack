import React, { useEffect, useState } from 'react';
import {
  Box, Button, Table, Tbody, Td, Th, Thead, Tr, Input, IconButton, HStack, VStack, useToast, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Image, FormLabel,
} from '@chakra-ui/react';
import { MdEdit, MdDelete, MdMyLocation } from 'react-icons/md';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaCar, FaMotorcycle, FaTruck } from 'react-icons/fa';


const truckIcon = L.icon({
  iconUrl: 'https://img.icons8.com/ios-filled/50/000000/truck.png',
  iconSize: [30, 30],
});

const DriverDashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    vehicleNumber: '',
    phone: '',
    status: 'active',
  });
  const [files, setFiles] = useState({ ktp: null, sim: null });
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDriverLocation, setSelectedDriverLocation] = useState(null);
  const [selectedDriverName, setSelectedDriverName] = useState('');
  const [selectedDriverDetails, setSelectedDriverDetails] = useState(''); // Store selected driver's details
  const [selectedDriverIcon, setSelectedDriverIcon] = useState(null);


  
  const toast = useToast();

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/drivers');
      setDrivers(response.data);
    } catch (error) {
      showToast('Error fetching drivers', error.message, 'error');
    }
  };

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [type]: file }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addOrUpdateDriver = async () => {
    if (!formData.name) {
      showToast('Input Error', 'Name is required.', 'warning');
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));
    if (files.ktp) formDataToSend.append('ktp', files.ktp);
    if (files.sim) formDataToSend.append('sim', files.sim);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/drivers/${editingId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Driver Updated', `${formData.name} has been updated!`, 'success');
      } else {
        await axios.post('http://localhost:5000/api/drivers', formDataToSend);
        showToast('Driver Added', `${formData.name} has been added!`, 'success');
      }
      fetchDrivers();
      clearForm();
    } catch (error) {
      showToast('Error', error.response?.data?.error || error.message, 'error');
    }
  };

  const clearForm = () => {
    setFormData({ name: '', vehicleNumber: '', phone: '', status: 'active' });
    setFiles({ ktp: null, sim: null });
    setEditingId(null);
  };

  const openFileModal = (fileUrl) => {
    setSelectedFile(fileUrl);
    setIsOpen(true);
  };

  const closeFileModal = () => {
    setIsOpen(false);
    setSelectedFile(null);
  };


  const handleEdit = (driver) => {
    setFormData({
      name: driver.name,
      vehicleNumber: driver.vehicle_number,
      phone: driver.phone,
      status: driver.status,
      vehicleType: driver.vehicle_type,
    });
    setEditingId(driver.id);
  };
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/drivers/${id}`);
      showToast('Driver Deleted', 'The driver has been deleted!', 'success');
      fetchDrivers();
    } catch (error) {
      showToast('Error', error.response?.data?.error || error.message, 'error');
    }
  };
  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType) {
      case 'car':
        return <FaCar />; 
      case 'motorcycle':
        return <FaMotorcycle />; 
      case 'truck':
        return <FaTruck />;
      default:
        return null; 
    }
  };
  const getVehicleTypeFromNumber = (vehicle_number) => {
    // Example logic to determine vehicle type based on vehicle number or other logic
    if (vehicle_number.startsWith('AB')) { // Example condition for a car
      return 'car';
    } else if (vehicle_number.startsWith('M')) { // Example condition for a motorcycle
      return 'motorcycle';
    } else if (vehicle_number.startsWith('T')) { // Example condition for a truck
      return 'truck';
    }
    return 'unknown'; 
  };
  
  
  const handleTrackDriver = (driver) => {
    const { latitude, longitude, name, vehicle_number, phone, status, vehicleType } = driver; 
    console.log("Driver Info:", driver);
    console.log("Vehicle Type:", vehicleType); 
  
    if (latitude && longitude) {
      setSelectedDriverLocation({ lat: latitude, lng: longitude });
      setSelectedDriverName(name);
      setSelectedDriverDetails(`Vehicle: ${vehicle_number}\nPhone: ${phone}\nStatus: ${status}`);
  

      const driverIcon = getVehicleIcon(vehicleType);
      setSelectedDriverIcon(driverIcon); 
      console.log("Driver Icon:", driverIcon); 
  
    } else {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setSelectedDriverLocation({ lat: latitude, lng: longitude });
    
            const defaultDriverIcon = getVehicleIcon('car');
            setSelectedDriverIcon(defaultDriverIcon);
          },
          (error) => {
            showToast('Location Error', 'Unable to retrieve your location.', 'error');
          }
        );
      } else {
        showToast('Geolocation not supported', 'Your browser does not support geolocation.', 'warning');
      }
    }
  };
  
  return (
    <Box p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Dashboard Driver</h2>
      <VStack spacing={4} mb={4}>
        <Input placeholder="Nama Driver" name="name" value={formData.name} onChange={handleInputChange} />
        <Input placeholder="Nomor Kendaraan" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} />
        <Input placeholder="Nomor Telepon" name="phone" value={formData.phone} onChange={handleInputChange} />
        <Select placeholder="Status" name="status" value={formData.status} onChange={handleInputChange}>
          <option value="active">Aktif</option>
          <option value="inactive">Non-Aktif</option>
        </Select>
        <Select placeholder="Pilih Armada" name="vehicleType" value={formData.vehicleType} onChange={handleInputChange}>
  <option value="truck">Truck</option>
  <option value="mobil">Mobil</option>
  <option value="motor">Motor</option>
</Select>


        <Box width="100%">
          <FormLabel htmlFor="vehicleDataFile">Upload KTP (ID Card)</FormLabel>
          <Input 
            id="vehicleDataFile" 
            type="file" 
            onChange={(e) => handleFileChange(e, 'ktp')} 
            accept=".jpg,.jpeg,.png,.pdf"
          />
        </Box>

        <Box width="100%">
          <FormLabel htmlFor="simFile">Upload SIM (Driving License)</FormLabel>
          <Input 
            id="simFile" 
            type="file" 
            onChange={(e) => handleFileChange(e, 'sim')} 
            accept=".jpg,.jpeg,.png,.pdf"
          />
        </Box>
        <Button onClick={addOrUpdateDriver} colorScheme="blue" width="full">
          {editingId ? 'Update Driver' : 'Tambah Driver'}
        </Button>
      </VStack>

      <Table size="md" mt={5}>
        <Thead>
          <Tr>
            <Th>No</Th>
            <Th>Nama</Th>
            <Th>Nomor Kendaraan</Th>
            <Th>Jenis Kendaraan</Th>
            <Th>Nomor Telepon</Th>
            <Th>Status</Th>
            <Th>SIM</Th>
            <Th>KTP</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {drivers.map((driver, index) => (
            <Tr key={driver.id}>
              <Td>{index + 1}</Td>
              <Td>{driver.name}</Td>
              
              <Td>{driver.vehicle_number}</Td>
              <Td>{driver.vehicle_type}</Td>
              <Td>{driver.phone}</Td>
              <Td>{driver.status}</Td>
              <Td>
                {driver.sim_url && (
                  <Image
                    src={`http://localhost:5000/uploads/${driver.sim_url}`}
                    alt="SIM"
                    boxSize="69px"
                    objectFit="cover"
                    onClick={() => openFileModal(`http://localhost:5000/uploads/${driver.sim_url}`)}
                    cursor="pointer"
                  />
                )}
              </Td>
              <Td>
                {driver.sim_url && (
                  <Image
                    src={`http://localhost:5000/uploads/${driver.ktp_url}`}
                    alt="KTP"
                    boxSize="69px"
                    objectFit="cover"
                    onClick={() => openFileModal(`http://localhost:5000/uploads/${driver.ktp_url}`)}
                    cursor="pointer"
                  />
                )}
              </Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    icon={<MdEdit />}
                    onClick={() => handleEdit(driver)}
                    aria-label="Edit Driver"
                  />
                  <IconButton
                    icon={<MdDelete />}
                    onClick={() => handleDelete(driver.id)}
                    aria-label="Delete Driver"
                  />
                  <IconButton
                    icon={<MdMyLocation />}
                    onClick={() => handleTrackDriver(driver)}
                    aria-label="Track Driver"
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={closeFileModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={selectedFile} alt="File" width="100%" />
          </ModalBody>
        </ModalContent>
      </Modal>

      {selectedDriverLocation && (
  <MapContainer center={selectedDriverLocation} zoom={13} style={{ height: '400px', width: '100%' }}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  />
  <Marker position={selectedDriverLocation} icon={truckIcon}>
    <Popup>
      <h4>{selectedDriverName}</h4> {/* Menampilkan nama driver */}
      <pre>{selectedDriverDetails}</pre> {/* Menampilkan detail driver */}
    </Popup>
    <Tooltip>{selectedDriverName}</Tooltip> {/* Tooltip menampilkan nama driver */}
  </Marker>
</MapContainer>

      )}
    </Box>
  );
};

export default DriverDashboard;
