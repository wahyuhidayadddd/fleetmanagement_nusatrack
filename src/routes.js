import React from 'react';
import { Icon } from '@chakra-ui/react';
import { MdMyLocation, MdPhotoCamera, MdWarning, MdPeople, MdDashboard, MdAccountBox } from 'react-icons/md';
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
    name: 'Pelacakan GPS',
    layout: '/admin',
    path: '/gps-tracking',
    icon: <Icon as={MdMyLocation} width="20px" height="20px" color="inherit" />,
    component: <GPSTrackingComponent />,
    feature: 'gps_tracking',
  },
  {
    name: 'Kamera Lacak',
    layout: '/admin',
    path: '/camera-tracking',
    icon: <Icon as={MdPhotoCamera} width="20px" height="20px" color="inherit" />,
    component: <CameraTrackingComponent />,
    feature: 'camera_tracking',
  },
  // {
  //   name: 'Deteksi Kerusakan',
  //   layout: '/admin',
  //   path: '/damage-detection',
  //   icon: <Icon as={MdWarning} width="20px" height="20px" color="inherit" />,
  //   component: <DamageDetectionComponent />,
  //   feature: 'damage_detection',
  // },
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
];

export default allRoutes;
