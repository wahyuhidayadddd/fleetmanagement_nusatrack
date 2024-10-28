import React, { useEffect, useState } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Ganti dengan API Key Google Maps Anda
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const TruckListComponent = () => {
  const [location, setLocation] = useState({ lat: -6.1751, lng: 106.8650 }); // Koordinat awal
  const [vehicleInfo, setVehicleInfo] = useState({
    id: 'ABC123',
    speed: '60 km/h',
    status: 'Sedang bergerak',
    lastReported: '2024-10-06 10:00:00',
  });

  useEffect(() => {
    // Simulasi pengambilan data lokasi
    const fetchLocationData = () => {
      // Ganti dengan API untuk mengambil data GPS dari backend Anda
      const newLocation = { lat: -6.1752, lng: 106.8651 }; // Simulasi lokasi baru
      setLocation(newLocation);
    };

    // Set interval untuk memperbarui lokasi setiap 5 detik
    const interval = setInterval(fetchLocationData, 5000);
    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, []);

  return (
    <Box padding="20px">
      <Heading as="h2" size="lg">Pelacakan GPS</Heading>
      <Text mt={4}>ID Kendaraan: {vehicleInfo.id}</Text>
      <Text>Kecepatan: {vehicleInfo.speed}</Text>
      <Text>Status: {vehicleInfo.status}</Text>
      <Text>Waktu Terakhir Dilaporkan: {vehicleInfo.lastReported}</Text>

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{ height: '400px', width: '100%' }}
          center={location}
          zoom={15}
        >
          <Marker position={location} />
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default TruckListComponent;
