import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Input,
  useToast,
  Button,
  HStack,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, LockIcon, UnlockIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';

const PAGE_SIZE = 10;

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);  
  const toast = useToast();


  const getToken = () => localStorage.getItem('token');
  
  useEffect(() => {
    const loadUsers = async () => {
      const token = getToken();
      if (!token) {
        showToast('Error', 'Anda tidak memiliki akses. Silakan login kembali.', 'error');
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        showToast('Error fetching users', error.response?.data?.error || error.message, 'error');
      } finally {
        setIsLoading(false); 
      }
    };

    loadUsers();
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

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleDeleteUser = async (userId) => {
    const token = getToken();
    if (!token) return;  

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(user => user.id !== userId));
      showToast('User Deleted', 'The user has been successfully deleted.', 'success');
    } catch (error) {
      console.error(error.response); 
      showToast('Error deleting user', error.response?.data?.error || error.message, 'error');
    }
  };

  const handleDisableUser = async (userId, isActive) => {
    try {
      const action = isActive ? 'disable' : 'enable'; 
      const token = getToken();
      if (!token) return;
  
   
      await axios.patch(`http://localhost:5000/api/admin/users/${userId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  

      setUsers(users.map(user =>
        user.id === userId ? { ...user, isActive: !isActive } : user
      ));
  
   
      showToast(isActive ? 'User Disabled' : 'User Enabled', `The user has been successfully ${isActive ? 'disabled' : 'enabled'}.`, 'success');
    } catch (error) {
      showToast('Error toggling user', error.response?.data?.error || error.message, 'error');
    }
  };

  return (
    <Box p={5} borderWidth={1} borderRadius="lg" boxShadow="xl" bg="white" maxW="1400px" mx="auto">
  <Text textAlign="center" fontSize="2xl" fontWeight="bold" mb={5} color="teal.600">
    Dashboard Pengguna
  </Text>

  <Input
    placeholder="Cari berdasarkan username atau email"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    mb={4}
    variant="filled"
    bg="gray.100"
    borderColor="teal.400"
    _focus={{ borderColor: 'teal.500' }}
    size="lg"
  />

  <Box overflowX="auto" maxHeight="600px" borderRadius="lg" border="1px solid" borderColor="gray.200">
    <Table variant="simple" colorScheme="teal" size="lg">
      <Thead bg="teal.600">
        <Tr>
          <Th color="white" py={4}>No</Th>
          <Th color="white" py={4}>Username</Th>
          <Th color="white" py={4}>Email</Th>
          <Th color="white" py={4}>Nama Perusahaan</Th>
          <Th color="white" py={4}>Nama Perangkat GPS</Th>
          <Th color="white" py={4}>Kode Perangkat GPS</Th>
          <Th color="white" py={4}>Tanggal Pembelian</Th>
          <Th color="white" py={4}>Alamat</Th>
          <Th color="white" py={4}>Aksi</Th>
        </Tr>
      </Thead>
      <Tbody>
        {isLoading ? (
          <Tr>
            <Td colSpan="10" textAlign="center" py={6}>Loading...</Td>
          </Tr>
        ) : (
          paginatedUsers.map((user, index) => (
            <Tr key={user.id} _hover={{ bg: 'teal.50' }}>
              <Td py={4}>{(currentPage - 1) * PAGE_SIZE + index + 1}</Td>
              <Td py={4}>{user.username}</Td>
              <Td py={4}>{user.email}</Td>
              <Td py={4}>{user.company_name}</Td>
              <Td py={4}>{user.gps_device_name}</Td>
              <Td py={4}>{user.gps_device_code}</Td>
              <Td py={4}>{new Date(user.purchase_date).toLocaleDateString()}</Td>
              <Td py={4}>{user.address}</Td>
              <Td py={4}>
                <HStack spacing={2}>
                  <IconButton
                    onClick={() => handleDisableUser(user.id, user.isActive)}
                    colorScheme={user.isActive ? "yellow" : "red"}
                    size="sm"
                    icon={user.isActive ? <LockIcon /> : <UnlockIcon />}
                    aria-label={user.isActive ? 'Nonaktifkan Pengguna' : 'Aktifkan Pengguna'}
                  />
                  <IconButton
                    onClick={() => handleDeleteUser(user.id)}
                    colorScheme="red"
                    size="sm"
                    icon={<DeleteIcon />}
                    aria-label="Hapus Pengguna"
                  />
                </HStack>
              </Td>
            </Tr>
          ))
        )}
      </Tbody>
    </Table>
  </Box>

  <HStack justifyContent="space-between" mt={4}>
    <Button
      leftIcon={<ChevronLeftIcon />}
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Sebelumnya
    </Button>
    <Text>
      Halaman {currentPage} dari {totalPages}
    </Text>
    <Button
      rightIcon={<ChevronRightIcon />}
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Berikutnya
    </Button>
  </HStack>
</Box>

  );
};

export default UserDashboard;
