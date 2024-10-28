import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Box, Heading, Select, Input, SimpleGrid, Card, Text, Stack, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Button, useDisclosure } from '@chakra-ui/react';
import L from 'leaflet';

const GPSTrackingComponent = () => {
  const [vehicleType, setVehicleType] = useState('car');
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleHistory, setVehicleHistory] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [playbackInterval, setPlaybackInterval] = useState(null);
  const [isEngineOn, setIsEngineOn] = useState(true);
  const [alarm, setAlarm] = useState(false);
  const mockVehicleData = [
    {
      id: 1,
      jenis_kendaraan: 'car',
      name: 'Mobil A',
      vehicleNumber: 'B 1234 CD',
      fuelLevel: 80,
      temperature: 22,
      position: [-6.1751, 106.8650],
      driver: {
        id: 1,
        name: 'John Doe',
        phone: '08123456789'
      },
      history: [
        [-6.1751, 106.8650],
        [-6.1761, 106.8660],
        [-6.1771, 106.8670]
      ]
    },
    {
      id: 2,
      jenis_kendaraan: 'motorcycle',
      name: 'Motor B',
      vehicleNumber: 'B 5678 EF',
      fuelLevel: 50,
      temperature: 24,
      position: [-6.1761, 106.8660],
      driver: {
        id: 2,
        name: 'Jane Smith',
        phone: '08234567890'
      },
      history: [
        [-6.1761, 106.8660],
        [-6.1771, 106.8670],
        [-6.1781, 106.8680]
      ]
    },
    {
      id: 3,
      jenis_kendaraan: 'truck',
      name: 'Truk C',
      vehicleNumber: 'B 9012 GH',
      fuelLevel: 60,
      temperature: 20,
      position: [-6.1771, 106.8670],
      driver: {
        id: 3,
        name: 'Mike Johnson',
        phone: '08345678901'
      },
      history: [
        [-6.1771, 106.8670],
        [-6.1781, 106.8680],
        [-6.1791, 106.8690]
      ]
    },
    {
      id: 4,
      jenis_kendaraan: 'car',
      name: 'Mobil D',
      vehicleNumber: 'B 3456 IJ',
      fuelLevel: 90,
      temperature: 23,
      position: [-6.1781, 106.8680],
      driver: {
        id: 4,
        name: 'Sara Connor',
        phone: '08456789012'
      },
      history: [
        [-6.1781, 106.8680],
        [-6.1791, 106.8690],
        [-6.1801, 106.8700]
      ]
    },
    {
      id: 5,
      jenis_kendaraan: 'motorcycle',
      name: 'Motor E',
      vehicleNumber: 'B 2345 KL',
      fuelLevel: 30,
      temperature: 25,
      position: [-6.1791, 106.8690],
      driver: {
        id: 5,
        name: 'Alex Turner',
        phone: '08567890123'
      },
      history: [
        [-6.1791, 106.8690],
        [-6.1801, 106.8700],
        [-6.1811, 106.8710]
      ]
    },
  ];
  
  const fetchVehicles = async (type) => {
    const filteredVehicles = mockVehicleData.filter(
      (vehicle) => vehicle.jenis_kendaraan === type && vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setVehicles(filteredVehicles);
  };

  useEffect(() => {
    fetchVehicles(vehicleType);
  }, [vehicleType, searchTerm]);

  const createVehicleIcon = (type) => {
    let iconHtml;
    switch (type) {
      case 'car':
        iconHtml = `<div style="color: blue; font-size: 24px;">🚗</div>`;
        break;
      case 'motorcycle':
        iconHtml = `<div style="color: green; font-size: 24px;">🏍️</div>`;
        break;
      case 'truck':
        iconHtml = `<div style="color: red; font-size: 24px;">🚚</div>`;
        break;
      default:
        iconHtml = `<div style="font-size: 24px;">❓</div>`;
    }
    return L.divIcon({
      className: 'custom-icon',
      html: iconHtml,
      iconSize: [30, 30],
      popupAnchor: [0, -15],
    });
  };

  const calculateDistance = (history) => {
    let totalDistance = 0;
    for (let i = 0; i < history.length - 1; i++) {
      const from = L.latLng(history[i][0], history[i][1]);
      const to = L.latLng(history[i + 1][0], history[i + 1][1]);
      totalDistance += from.distanceTo(to) / 1000; // convert to km
    }
    return totalDistance.toFixed(2);
  };

  const handleVehicleClick = (vehicle) => {
    const distance = calculateDistance(vehicle.history);
    setTotalDistance(distance);
    setVehicleHistory(vehicle.history);
    setSelectedVehicle(vehicle);
    setCurrentHistoryIndex(0); 
    setIsEngineOn(true); 
    setAlarm(false); 
    onOpen(); 
  };

  const startPlayback = () => {
    // ... playback logic
  };

  const stopPlayback = () => {
    // ... stop logic
  };

  useEffect(() => {
    if (currentHistoryIndex >= vehicleHistory.length - 1) {
      setAlarm(true);
    }
  }, [currentHistoryIndex, vehicleHistory]);

  const handleEngineToggle = () => {
    setIsEngineOn((prev) => !prev); // Toggle engine status
  };

  const handleAlarmToggle = () => {
    setAlarm((prev) => !prev); // Toggle alarm status
  };

  return (
    <Box padding="20px">
      <Heading as="h2" size="lg" mb={4}>
        Pelacakan GPS dengan Sensor
      </Heading>

      {/* Filter & Search */}
      <SimpleGrid columns={[1, 2]} spacing={4} mb={4}>
        <Select
          placeholder="Pilih Jenis Kendaraan"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="car">Mobil</option>
          <option value="motorcycle">Motor</option>
          <option value="truck">Truk</option>
        </Select>

        <Input
          placeholder="Cari Kendaraan (ID atau Nama)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SimpleGrid>

      {/* Statistik Kendaraan */}
      <SimpleGrid columns={[3]} spacing={4} mb={4}>
        <Card>
          <Stack align="center" padding={4}>
            <Text fontSize="2xl" color="blue.500">🚗</Text>
            <Text fontWeight="bold">Mobil Aktif: {vehicles.filter((v) => v.jenis_kendaraan === 'car').length}</Text>
          </Stack>
        </Card>
        <Card>
          <Stack align="center" padding={4}>
            <Text fontSize="2xl" color="green.500">🏍️</Text>
            <Text fontWeight="bold">Motor Aktif: {vehicles.filter((v) => v.jenis_kendaraan === 'motorcycle').length}</Text>
          </Stack>
        </Card>
        <Card>
          <Stack align="center" padding={4}>
            <Text fontSize="2xl" color="red.500">🚚</Text>
            <Text fontWeight="bold">Truk Aktif: {vehicles.filter((v) => v.jenis_kendaraan === 'truck').length}</Text>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Tampilkan Peta */}
      <MapContainer center={[-6.1751, 106.8650]} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={vehicle.position}
            icon={createVehicleIcon(vehicle.jenis_kendaraan)}
            eventHandlers={{
              click: () => handleVehicleClick(vehicle),
            }}
          >
            <Popup>
              <Text fontWeight="bold">{vehicle.name}</Text>
              <Text>Nomor Kendaraan: {vehicle.vehicleNumber}</Text>
              <Text>Sisa Bahan Bakar: {vehicle.fuelLevel}%</Text>
              <Text>Suhu: {vehicle.temperature}°C</Text>
              <Text>Driver: {vehicle.driver.name}</Text>
            </Popup>
          </Marker>
        ))}

        {selectedVehicle && (
          <Polyline
            positions={vehicleHistory}
            color="blue"
            weight={5}
            opacity={0.5}
            smoothFactor={1}
          />
        )}
      </MapContainer>

      {/* Playback Controls */}
      <Box mt={4}>
        <Button onClick={startPlayback} colorScheme="blue" mr={2}>Play</Button>
        <Button onClick={stopPlayback} colorScheme="red">Stop</Button>
      </Box>

      {/* Alarm Notification */}
      {alarm && (
        <Box mt={4} color="red.500">
          🚨 Alarm: Kendaraan telah berhenti!
        </Box>
      )}

      {/* Drawer for vehicle details */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>{selectedVehicle?.name} - Detail Kendaraan</DrawerHeader>
          <DrawerBody>
            <Text fontWeight="bold">Nomor Kendaraan: {selectedVehicle?.vehicleNumber}</Text>
            <Text>Sisa Bahan Bakar: {selectedVehicle?.fuelLevel}%</Text>
            <Text>Suhu: {selectedVehicle?.temperature}°C</Text>
            <Text>Driver: {selectedVehicle?.driver.name}</Text>
            <Text>Telepon Driver: {selectedVehicle?.driver.phone}</Text>
            <Text>Total Jarak: {totalDistance} km</Text>

            {/* Engine and Alarm Controls */}
            <Button
              onClick={handleEngineToggle}
              colorScheme={isEngineOn ? 'green' : 'red'}
              mt={4}
            >
              {isEngineOn ? 'Matikan Mesin' : 'Nyalakan Mesin'}
            </Button>
            <Button
              onClick={handleAlarmToggle}
              colorScheme={alarm ? 'red' : 'gray'}
              mt={2}
            >
              {alarm ? 'Matikan Alarm' : 'Nyalakan Alarm'}
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default GPSTrackingComponent;
