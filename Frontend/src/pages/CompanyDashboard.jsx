// import React, { useState, useEffect } from 'react';
// import { Box, Heading, Text, VStack, HStack, IconButton, useToast } from '@chakra-ui/react';
// import { FaUserEdit } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Navbar from '../components/Navbar.jsx';
// import Footer from '../components/Footer.jsx';
// import CreateAd from '../components/CreateAd.jsx';
// import { useAuth } from '../contexts/AuthContext.jsx';

// function CompanyDashboard() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const toast = useToast();
//   const [ads, setAds] = useState([]);
//   const [notifications, setNotifications] = useState([]);

//   const fetchAds = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get('http://localhost:5001/api/ads/my-ads', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAds(res.data);
//     } catch (err) {
//       console.error('Error fetching ads:', err);
//     }
//   };

//   const fetchNotifications = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get('http://localhost:5001/api/users/notifications', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotifications(res.data);
//       res.data.forEach((notif) => {
//         toast({
//           title: 'Notification',
//           description: notif.message,
//           status: 'info',
//           duration: 5000,
//           isClosable: true,
//         });
//       });
//     } catch (err) {
//       console.error('Error fetching notifications:', err);
//     }
//   };

//   useEffect(() => {
//     fetchAds();
//     fetchNotifications();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <Box minH="calc(100vh - 160px)" p={6} bg="gray.50">
//         <HStack justify="space-between" mb={6}>
//           <Heading size="lg" color="brand.500">Company Dashboard</Heading>
//           <IconButton
//             icon={<FaUserEdit />}
//             colorScheme="brand"
//             onClick={() => navigate('/company/profile')}
//             aria-label="Edit Profile"
//           />
//         </HStack>
//         <VStack spacing={6} align="stretch">
//           <Text fontSize="xl">Welcome, {user.name}!</Text>
//           <CreateAd onAdCreated={fetchAds} />
//           <Text fontSize="lg">Your Ads</Text>
//           {ads.length === 0 ? (
//             <Text>No ads created yet.</Text>
//           ) : (
//             ads.map((ad) => (
//               <Box key={ad._id} p={4} bg="white" borderRadius="md" boxShadow="md">
//                 <Text fontWeight="bold">{ad.title}</Text>
//                 <Text>{ad.description}</Text>
//                 <Text>Budget: ${ad.budget}</Text>
//                 <Text>Category: {ad.category}</Text>
//                 <Text>Status: {ad.status}</Text>
//                 {ad.status === 'accepted' && ad.acceptedBy && (
//                   <Text>Accepted by: {ad.acceptedBy.name}</Text>
//                 )}
//               </Box>
//             ))
//           )}
//         </VStack>
//       </Box>
//       <Footer />
//     </>
//   );
// }

// export default CompanyDashboard;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { FaUserEdit, FaBars, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import CreateAd from '../components/CreateAd.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function CompanyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isNotifOpen, onOpen: onNotifOpen, onClose: onNotifClose } = useDisclosure();
  const [ads, setAds] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const fetchAds = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/ads/my-ads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAds(res.data);
    } catch (err) {
      console.error('Error fetching ads:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/users/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
      setUnreadNotifications(res.data.length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchAds();
    fetchNotifications();
  }, []);

  const handleNotifOpen = () => {
    setUnreadNotifications(0); // Mark notifications as read when opened
    onNotifOpen();
  };

  return (
    <>
      <Navbar />
      <Box minH="calc(100vh - 160px)" p={6} bg="gray.50">
        <HStack justify="space-between" mb={6}>
          <HStack>
            <IconButton
              icon={<FaBars />}
              colorScheme="brand"
              onClick={onOpen}
              aria-label="Open Sidebar"
            />
            <Heading size="lg" color="brand.500">Company Dashboard</Heading>
          </HStack>
          <HStack>
            <Popover>
              <PopoverTrigger>
                <IconButton
                  icon={<FaBell />}
                  colorScheme="brand"
                  onClick={handleNotifOpen}
                  aria-label="Notifications"
                  position="relative"
                >
                  {unreadNotifications > 0 && (
                    <Badge
                      position="absolute"
                      top="-1"
                      right="-1"
                      colorScheme="red"
                      borderRadius="full"
                      px={2}
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </IconButton>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>Notifications</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  {notifications.length === 0 ? (
                    <Text>No notifications.</Text>
                  ) : (
                    notifications.map((notif, index) => (
                      <Text key={index} mb={2}>
                        {notif.message} - {new Date(notif.createdAt).toLocaleDateString()}
                      </Text>
                    ))
                  )}
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <IconButton
              icon={<FaUserEdit />}
              colorScheme="brand"
              onClick={() => navigate('/company/profile')}
              aria-label="Edit Profile"
            />
          </HStack>
        </HStack>
        <VStack spacing={6} align="stretch">
          <Text fontSize="xl">Welcome, {user.name}!</Text>
          <CreateAd onAdCreated={fetchAds} />
          <Text fontSize="lg">Your Ads</Text>
          {ads.length === 0 ? (
            <Text>No ads created yet.</Text>
          ) : (
            ads.map((ad) => (
              <Box key={ad._id} p={4} bg="white" borderRadius="md" boxShadow="md">
                <Text fontWeight="bold">{ad.title}</Text>
                <Text>{ad.description}</Text>
                <Text>Budget: ${ad.budget}</Text>
                <Text>Category: {ad.category}</Text>
                <Text>Status: {ad.status}</Text>
                {ad.status === 'accepted' && ad.acceptedBy && (
                  <Text>Accepted by: {ad.acceptedBy.name}</Text>
                )}
              </Box>
            ))
          )}
        </VStack>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Accepted Ads</DrawerHeader>
          <DrawerBody>
            {ads.filter((ad) => ad.status === 'accepted').length === 0 ? (
              <Text>No ads have been accepted yet.</Text>
            ) : (
              ads
                .filter((ad) => ad.status === 'accepted')
                .map((ad) => (
                  <Box key={ad._id} p={4} mb={4} bg="gray.100" borderRadius="md">
                    <Text fontWeight="bold">{ad.title}</Text>
                    <Text>{ad.description}</Text>
                    <Text>Budget: ${ad.budget}</Text>
                    <Text>Category: {ad.category}</Text>
                    <Text>Accepted by: {ad.acceptedBy.name}</Text>
                    {ad.proof && ad.proof.submittedAt ? (
                      <Box mt={2}>
                        <Text fontWeight="bold">Proof Submitted:</Text>
                        <Text>Link: <a href={ad.proof.link} target="_blank" rel="noopener noreferrer">{ad.proof.link}</a></Text>
                        <Text>Description: {ad.proof.description}</Text>
                        <Text>Submitted At: {new Date(ad.proof.submittedAt).toLocaleDateString()}</Text>
                      </Box>
                    ) : (
                      <Text mt={2}>Proof: Not submitted yet</Text>
                    )}
                  </Box>
                ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Footer />
    </>
  );
}

export default CompanyDashboard;