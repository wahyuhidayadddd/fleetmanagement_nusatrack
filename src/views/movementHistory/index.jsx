import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box } from '@chakra-ui/react';

const MovementHistoryComponent = () => {
  // Data contoh riwayat pergerakan
  const historyData = [
    { id: 1, date: '2024-10-01', location: 'Jakarta', status: 'Dalam Perjalanan' },
    { id: 2, date: '2024-10-02', location: 'Bandung', status: 'Terkirim' },
    { id: 3, date: '2024-10-03', location: 'Surabaya', status: 'Dalam Perjalanan' },
    { id: 4, date: '2024-10-04', location: 'Yogyakarta', status: 'Tertunda' },
  ];

  return (
    <Box p={4}>
      <h1>Riwayat Pergerakan</h1>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Tanggal</Th>
            <Th>Lokasi</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {historyData.map((entry) => (
            <Tr key={entry.id}>
              <Td>{entry.id}</Td>
              <Td>{entry.date}</Td>
              <Td>{entry.location}</Td>
              <Td>{entry.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default MovementHistoryComponent;
