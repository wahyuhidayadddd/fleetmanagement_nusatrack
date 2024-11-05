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

const PAGE_SIZE = 10; // Number of users per page

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        showToast('Error fetching users', error.response?.data?.error || error.message, 'error');
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

  // Filter and paginate users
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(users.filter(user => user.id !== userId));
      showToast('User Deleted', 'The user has been successfully deleted.', 'success');
    } catch (error) {
      showToast('Error deleting user', error.response?.data?.error || error.message, 'error');
    }
  };

  const handleDisableUser = async (userId, isActive) => {
    try {
      const action = isActive ? 'disable' : 'enable';
      await axios.patch(`http://localhost:5000/api/admin/users/${userId}/${action}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: !isActive } : user
      ));
      showToast(isActive ? 'User Disabled' : 'User Enabled', `The user has been successfully ${isActive ? 'disabled' : 'enabled'}.`, 'success');
    } catch (error) {
      showToast('Error disabling user', error.response?.data?.error || error.message, 'error');
    }
  };

  return (
    <Box p={5} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
      <Text textAlign="center" fontSize="2xl" fontWeight="bold" mb={4} color="teal.600">User Dashboard</Text>
      
      <Input
        placeholder="Search by username or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
        variant="filled"
        bg="gray.100"
        borderColor="teal.400"
      />

      <Table variant="striped" colorScheme="teal" size="md">
        <Thead>
          <Tr>
            <Th>No</Th>
            <Th>Username</Th>
            <Th>Email</Th>
            <Th>Company Name</Th>
            <Th>GPS Device Name</Th>
            <Th>GPS Device Code</Th>
            <Th>Purchase Date</Th>
            <Th>Bulan Pembelian</Th>
            <Th>Expiry Date</Th>
            <Th>Address</Th>
            <Th>Actions</Th> 
          </Tr>
        </Thead>
        <Tbody>
          {paginatedUsers.map((user, index) => (
            <Tr key={user.id}>
              <Td>{(currentPage - 1) * PAGE_SIZE + index + 1}</Td>
              <Td>{user.username}</Td>
              <Td>{user.email}</Td>
              <Td>{user.company_name}</Td>
              <Td>{user.gps_device_name}</Td>
              <Td>{user.gps_device_code}</Td>
              <Td>{new Date(user.purchase_date).toLocaleDateString()}</Td>
              <Td>{user.bulan_pembelian}</Td>
              <Td>{new Date(user.expiry_date).toLocaleDateString()}</Td>
              <Td>{user.address}</Td>
              <Td>
                <IconButton 
                  onClick={() => handleDisableUser(user.id, user.isActive)} 
                  colorScheme={user.isActive ? "yellow" : "teal"} 
                  size="sm" 
                  mr={2}
                  icon={user.isActive ? <LockIcon /> : <UnlockIcon />}
                  aria-label={user.isActive ? 'Disable User' : 'Enable User'}
                />
                <Button onClick={() => handleDeleteUser(user.id)} colorScheme="red" size="sm">
                  <DeleteIcon />
                </Button>
              </Td>
            </Tr>
          ))} 
        </Tbody>
      </Table>

      <HStack spacing={4} mt={4} justify="center">
        <IconButton
          icon={<ChevronLeftIcon />}
          isDisabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          aria-label="Previous Page"
          variant="outline"
          colorScheme="teal"
        />
        <Text fontWeight="bold">Page {currentPage} of {totalPages}</Text>
        <IconButton
          icon={<ChevronRightIcon />}
          isDisabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          aria-label="Next Page"
          variant="outline"
          colorScheme="teal"
        />
      </HStack>
    </Box>
  );
};

export default UserDashboard;
