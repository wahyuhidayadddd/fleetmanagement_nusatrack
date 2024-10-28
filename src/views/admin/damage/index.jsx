import React, { useEffect, useState } from 'react';
import { Box, Text, Button, VStack, Spinner } from '@chakra-ui/react';

const DamageDetectionComponent = () => {
  const [damageData, setDamageData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mendapatkan data kerusakan
  const fetchDamageData = async () => {
    try {
      setLoading(true);
      // Ganti dengan endpoint API Anda untuk mendapatkan data kerusakan
      const response = await fetch('https://api.example.com/damage-data');
      const data = await response.json();
      setDamageData(data);
    } catch (error) {
      console.error('Error fetching damage data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDamageData(); // Panggil fungsi untuk mendapatkan data saat komponen pertama kali dimuat
  }, []);

  return (
    <Box p={5}>
      {loading ? (
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading damage data...</Text>
        </VStack>
      ) : damageData.length > 0 ? (
        <Box>
          <Text fontSize="2xl" mb={4}>Damage Detection</Text>
          {damageData.map((damage, index) => (
            <Box key={index} borderWidth="1px" borderRadius="lg" p={4} mb={4}>
              <Text fontWeight="bold">Damage ID: {damage.id}</Text>
              <Text>Location: {damage.location}</Text>
              <Text>Description: {damage.description}</Text>
              <Text>Status: {damage.status}</Text>
              <Button colorScheme="red" onClick={() => alert(`Investigating damage ${damage.id}`)}>
                Investigate
              </Button>
            </Box>
          ))}
        </Box>
      ) : (
        <Text>No damage data available.</Text>
      )}
    </Box>
  );
};

export default DamageDetectionComponent;
