import React, { useState, useEffect } from "react";

// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  // Chakra color mode
  const logoColor = useColorModeValue("navy.700", "white");
  const [userData, setUserData] = useState(null);

  // Function to fetch user data
  const fetchUserData = async () => {
    const token = localStorage.getItem("token"); 
    const response = await fetch("http://localhost:5000/api/lihatdata", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUserData(data.user); 
    } else {
      console.error("Failed to fetch user data");
    }
  };

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Flex align="center" direction="column">
      <Flex align="center" direction="row">
        <Text
          fontSize="2xl" 
          fontWeight="bold" 
          letterSpacing="wider"
          color={logoColor} 
          fontFamily="Poppins, sans-serif" 
        >
          {userData ? ` ${userData.company_name}` : "Loading..."}
        </Text>
      </Flex>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
