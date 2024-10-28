import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdMyLocation,     
  MdPhotoCamera,    
  MdWarning,
  MdPeople,
  MdDashboard,  // Ikon untuk dashboard
} from 'react-icons/md';

import GPSTrackingComponent from 'views/admin/gps';
import CameraTrackingComponent from 'views/admin/camera';
import DamageDetectionComponent from 'views/admin/damage';
import DriverDashboard from 'views/admin/DriverDashboard'; 
import MainDashboard from 'views/admin/MainDashboard';  

const trackingRoutes = [
  {
    name: 'Dashboard Utama', 
    layout: '/admin',
    path: '/main-dashboard', 
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />, 
    component: <MainDashboard />,  
  },
  {
    name: 'Pelacakan GPS',
    layout: '/admin',
    path: '/gps-tracking',
    icon: <Icon as={MdMyLocation} width="20px" height="20px" color="inherit" />,
    component: <GPSTrackingComponent />, 
  },
  {
    name: 'Kamera Lacak',
    layout: '/admin',
    path: '/camera-tracking',
    icon: <Icon as={MdPhotoCamera} width="20px" height="20px" color="inherit" />,
    component: <CameraTrackingComponent />, 
  },
  {
    name: 'Deteksi Kerusakan',
    layout: '/admin',
    path: '/damage-detection',
    icon: <Icon as={MdWarning} width="20px" height="20px" color="inherit" />,
    component: <DamageDetectionComponent />, 
  },
  {
    name: 'Driver',
    layout: '/admin',
    path: '/driver-dashboard', 
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: <DriverDashboard />, 
  },
];

export default trackingRoutes;
