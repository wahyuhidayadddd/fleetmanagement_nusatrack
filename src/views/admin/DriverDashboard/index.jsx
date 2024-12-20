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
    sim_url: ''
  });
  const [files, setFiles] = useState({ ktp: null, sim: null });
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDriverLocation, setSelectedDriverLocation] = useState(null);
  const [selectedDriverName, setSelectedDriverName] = useState('');
  const [selectedDriverDetails, setSelectedDriverDetails] = useState(''); 
  const [selectedDriverIcon, setSelectedDriverIcon] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [users, setUsers] = useState([]);
  
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = token.split('.')[1]; 
      const decodedData = JSON.parse(atob(decodedToken)); 
      setUserRole(decodedData.role);
    }
  }, []);
  const fetchDrivers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/drivers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setDrivers(response.data);
    } catch (error) {
      showToast('Error fetching drivers', error.message, 'error');
    }
  };
  


  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token'); 
      try {
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
      }
    };
  
    fetchUsers();
  }, []); 
  
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
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));
  
    if (files.ktp) formDataToSend.append('ktp', files.ktp);
    if (files.sim) formDataToSend.append('sim', files.sim);
  
    const token = localStorage.getItem('token');
    if (!token) {
      showToast('Error', 'No valid token found. Please log in again.', 'error');
      return;
    }
  
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };
  
    try {
      if (editingId) {
        const response = await axios.put(`http://localhost:5000/api/drivers/${editingId}`, formDataToSend, { headers });
        showToast('Driver Updated', `${formData.name} has been updated!`, 'success');
      } else {
        const response = await axios.post('http://localhost:5000/api/drivers', formDataToSend, { headers });
        showToast('Driver Added', `${formData.name} has been added!`, 'success');
      }
  
      fetchDrivers();
      clearForm();
    } catch (error) {
      console.error(error);  
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
      ktp_url: driver.ktp_url, 
      sim_url: driver.sim_url, 
    });
    setEditingId(driver.id);
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth',  
    });
  };
  
  

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
    
      await axios.delete(`http://localhost:5000/api/drivers/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
  
     
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
   
    if (vehicle_number.startsWith('AB')) { 
      return 'car';
    } else if (vehicle_number.startsWith('M')) {
      return 'motorcycle';
    } else if (vehicle_number.startsWith('T')) {
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
      {userRole === 'admin' && (
  <VStack spacing={4} mb={4}>
    <Select
      placeholder="Pilih Pengguna"
      name="userId"
      value={formData.userId}
      onChange={handleInputChange}
    >
      {users.map((user) => (
        <option value={user.id} key={user.id}>
          {user.username} - {user.email} ({user.company_name})
        </option>
      ))}
    </Select>
    <Input
      placeholder="Nama Driver"
      name="name"
      value={formData.name}
      onChange={handleInputChange}
    />
    <Input
      placeholder="Nomor Kendaraan"
      name="vehicleNumber"
      value={formData.vehicleNumber}
      onChange={handleInputChange}
    />
    <Input
      placeholder="Nomor Telepon"
      name="phone"
      value={formData.phone}
      onChange={handleInputChange}
    />
    <Input
      placeholder="Nama Alat GPS"
      name="gpsDeviceName"
      value={formData.gpsDeviceName}
      onChange={handleInputChange}
    />
    <Input
      placeholder="Kode Alat GPS"
      name="gpsDeviceCode"
      value={formData.gpsDeviceCode}
      onChange={handleInputChange}
    />
    <Select
      placeholder="Status"
      name="status"
      value={formData.status}
      onChange={handleInputChange}
    >
      <option value="active">Aktif</option>
      <option value="inactive">Non-Aktif</option>
    </Select>
    <Select
      placeholder="Pilih Armada"
      name="vehicleType"
      value={formData.vehicleType}
      onChange={handleInputChange}
    >
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
)}
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
      <h4>{selectedDriverName}</h4>
      <pre>{selectedDriverDetails}</pre>
    </Popup>
    <Tooltip>{selectedDriverName}</Tooltip> 
  </Marker>
</MapContainer>

      )}
    </Box>
  );
};

export default DriverDashboard;
