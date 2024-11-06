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
    <Box p={5} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white" maxW="1200px" mx="auto">
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
      />

   
      <Box overflowY="auto" maxHeight="400px">
        <Table variant="striped" colorScheme="teal" size="md">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Username</Th>
              <Th>Email</Th>
              <Th>Nama Perusahaan</Th>
              <Th>Nama Perangkat GPS</Th>
              <Th>Kode Perangkat GPS</Th>
              <Th>Tanggal Pembelian</Th>
              {/* <Th>Tanggal Kedaluwarsa</Th> */}
              <Th>Alamat</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan="10" textAlign="center">Loading...</Td>
              </Tr>
            ) : (
              paginatedUsers.map((user, index) => (
                <Tr key={user.id}>
                  <Td>{(currentPage - 1) * PAGE_SIZE + index + 1}</Td>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.company_name}</Td>
                  <Td>{user.gps_device_name}</Td>
                  <Td>{user.gps_device_code}</Td>
                  <Td>{new Date(user.purchase_date).toLocaleDateString()}</Td>
                  {/* <Td>{new Date(user.expiry_date).toLocaleDateString()}</Td> */}
                  <Td>{user.address}</Td>
                  <Td>

  <IconButton
    onClick={() => handleDisableUser(user.id, user.isActive)}  
    colorScheme={user.isActive ? "yellow" : "red"} 
    size="sm"
    mr={2}
    icon={user.isActive ? <LockIcon /> : <UnlockIcon />} 
    aria-label={user.isActive ? 'Nonaktifkan Pengguna' : 'Aktifkan Pengguna'}
    _hover={{
      backgroundColor: user.isActive ? "yellow.200" : "red.200", 
    }}
  />
  

  <Button
    onClick={() => handleDeleteUser(user.id)} 
    colorScheme="red" 
    size="sm"
    _hover={{
      backgroundColor: "red.300",
    }}
  >
    <DeleteIcon />
  </Button>
</Td>

                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>


      <HStack spacing={4} mt={4} justify="center">
        <IconButton
          icon={<ChevronLeftIcon />}
          isDisabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          aria-label="Halaman Sebelumnya"
          variant="outline"
          colorScheme="teal"
        />
        <Text fontWeight="bold">Halaman {currentPage} dari {totalPages}</Text>
        <IconButton
          icon={<ChevronRightIcon />}
          isDisabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          aria-label="Halaman Berikutnya"
          variant="outline"
          colorScheme="teal"
        />
      </HStack>
    </Box>
  );
};

export default UserDashboard;
