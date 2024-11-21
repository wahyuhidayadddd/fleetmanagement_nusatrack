import React, { useState, useEffect } from "react";


import { Flex, Text, useColorModeValue } from "@chakra-ui/react";


import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
 
  const logoColor = useColorModeValue("navy.700", "white");
  const [userData, setUserData] = useState(null);


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


  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Flex align="center" direction="column">
      <Flex align="center" direction="row">
        <Text
          fontSize="16px" 
          fontWeight="bold" 
          letterSpacing="wider"
          color={logoColor} 
          fontFamily="Poppins, sans-serif" 
        >
          {userData ? ` ${userData.nama_perusahaan}` : "Loading..."}
        </Text>
      </Flex>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
