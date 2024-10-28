import React from "react";

// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  // Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <Flex align='center' direction='row'>

        {/* Cool and stylish text */}
        <Text
          fontSize="2xl"       // Larger font size for logo
          fontWeight="bold"     // Bold for emphasis
          letterSpacing="wider" // Letter spacing to make it look more stylish
          color={logoColor}     // Dynamic color based on mode (light or dark)
          fontFamily="Poppins, sans-serif" // Use a cool font like Poppins or any custom font
        >
        NUSA TECHNO
        </Text>
      </Flex>
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
