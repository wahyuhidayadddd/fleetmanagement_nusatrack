import React from 'react';
import { Badge, Box, Icon } from '@chakra-ui/react';
import { MdMyLocation, MdPhotoCamera, MdWarning, MdPeople, MdDashboard, MdAccountBox, MdMap, MdVideocam } from 'react-icons/md';
import GPSTrackingComponent from 'views/admin/gps';
import CameraTrackingComponent from 'views/admin/camera';
import DamageDetectionComponent from 'views/admin/damage';
import DriverDashboard from 'views/admin/DriverDashboard';
import MainDashboard from 'views/admin/MainDashboard';
import AkunUser from 'views/admin/akunuser';


export const allRoutes = [
  {
    name: 'Dashboard Utama',
    layout: '/admin',
    path: '/main-dashboard',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
    feature: 'dashboard', 
  },
  {
    name: ' Map ',
    layout: '/admin',
    path: '/gps-tracking',
    icon: <Icon as={MdMap} width="20px" height="20px" color="inherit" />,
    component: <GPSTrackingComponent />,
    feature: 'gps_tracking',
  },
  {
    name: 'Camera',
    layout: '/admin',
    path: '/camera-tracking',
    icon: (
      <Box position="relative" display="inline-block">
        {/* Ikon Kamera */}
        <Icon as={MdVideocam} width="20px" height="20px" color="inherit" />
  
        {/* Label Beta di atas ikon */}
        <Badge 
          position="absolute" 
          top="-19px" 
          right="-14px" 
     
          colorScheme="yellow" 
          fontSize="0.6em"
        >
          Beta
        </Badge>
      </Box>
    ),
    component: <CameraTrackingComponent />,
    feature: 'camera_tracking',
  },
  
  
  {
    name: 'Cut Engine (Matikan Mesin)',
    layout: '/admin',
    path: '/damage-detection',
    icon: <Icon as={MdWarning} width="20px" height="20px" color="inherit" />,
    component: <DamageDetectionComponent />,
    feature: 'damage_detection',
  },
  {
    name: 'Pendaftaran Drivers',
    layout: '/admin',
    path: '/driver-dashboard',
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: <DriverDashboard />,
    feature: 'driver_dashboard',
  },
  {
    name: 'Akun Costumer',
    layout: '/admin',
    path: '/akunuser',
    icon: <Icon as={MdAccountBox} width="20px" height="20px" color="inherit" />,
    component: <AkunUser />,
    feature: 'akun_user',
  },
  {
    name: 'Laporan',
    layout: '/admin',
    path: '/akunuser',
    icon: <Icon as={MdAccountBox} width="20px" height="20px" color="inherit" />,
    component: <AkunUser />,
    feature: 'akun_user',
  },
];

export default allRoutes;
