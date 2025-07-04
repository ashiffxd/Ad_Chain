// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Heading,
//   Text,
//   Button,
//   VStack,
//   HStack,
//   IconButton,
//   useToast,
//   Drawer,
//   DrawerBody,
//   DrawerHeader,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerCloseButton,
//   useDisclosure,
//   FormControl,
//   FormLabel,
//   Input,
//   Textarea,
// } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import { FaUserEdit, FaBars } from 'react-icons/fa';
// import axios from 'axios';
// import Navbar from '../components/Navbar.jsx';
// import Footer from '../components/Footer.jsx';
// import { useAuth } from '../contexts/AuthContext.jsx';

// function InfluencerDashboard() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const toast = useToast();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [ads, setAds] = useState([]);
//   const [acceptedAds, setAcceptedAds] = useState([]);
//   const [proofData, setProofData] = useState({ link: '', description: '' });
//   const [selectedAd, setSelectedAd] = useState(null);

//   useEffect(() => {
//     const fetchAds = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('http://localhost:5001/api/ads', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAds(res.data);
//       } catch (err) {
//         console.error('Error fetching ads:', err);
//       }
//     };

//     const fetchAcceptedAds = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('http://localhost:5001/api/ads/accepted', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAcceptedAds(res.data);
//       } catch (err) {
//         console.error('Error fetching accepted ads:', err);
//       }
//     };

//     fetchAds();
//     fetchAcceptedAds();
//   }, []);

//   const handleAcceptAd = async (adId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         `http://localhost:5001/api/ads/${adId}/accept`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setAds(ads.filter((ad) => ad._id !== adId));
//       const res = await axios.get('http://localhost:5001/api/ads/accepted', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAcceptedAds(res.data);
//       toast({
//         title: 'Ad Accepted',
//         description: 'The ad has been accepted successfully.',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });
//     } catch (err) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.message || 'Failed to accept ad',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   const handleSubmitProof = async (adId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         `http://localhost:5001/api/ads/${adId}/submit-proof`,
//         proofData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const res = await axios.get('http://localhost:5001/api/ads/accepted', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAcceptedAds(res.data);
//       setProofData({ link: '', description: '' });
//       setSelectedAd(null);
//       toast({
//         title: 'Proof Submitted',
//         description: 'Your proof has been submitted successfully.',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });
//     } catch (err) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.message || 'Failed to submit proof',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <Box minH="calc(100vh - 160px)" p={6} bg="gray.50">
//         <HStack justify="space-between" mb={6}>
//           <HStack>
//             <IconButton
//               icon={<FaBars />}
//               colorScheme="blue"
//               onClick={onOpen}
//               aria-label="Open Sidebar"
//             />
//             <Heading size="lg" color="blue.600">Influencer Dashboard</Heading>
//           </HStack>
//           <IconButton
//             icon={<FaUserEdit />}
//             colorScheme="blue"
//             onClick={() => navigate('/influencer/profile')}
//             aria-label="Edit Profile"
//           />
//         </HStack>
//         <VStack spacing={4} align="stretch">
//           <Text fontSize="xl">Welcome, {user.name}!</Text>
//           <Text fontSize="lg">
//             Ad Feed (Matching Your Categories: {user.categories.join(', ')})
//           </Text>
//           {ads.length === 0 ? (
//             <Text>No ads available in your categories.</Text>
//           ) : (
//             ads.map((ad) => (
//               <Box key={ad._id} p={4} bg="white" borderRadius="md" boxShadow="md">
//                 <Text fontWeight="bold">{ad.title}</Text>
//                 <Text>{ad.description}</Text>
//                 <Text>Budget: ${ad.budget}</Text>
//                 <Text>Category: {ad.category}</Text>
//                 <Text>Posted by: {ad.companyId.name}</Text>
//                 <Button mt={2} colorScheme="blue" onClick={() => handleAcceptAd(ad._id)}>
//                   Accept Ad
//                 </Button>
//               </Box>
//             ))
//           )}
//         </VStack>
//       </Box>
//       <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
//         <DrawerOverlay />
//         <DrawerContent>
//           <DrawerCloseButton />
//           <DrawerHeader>Accepted Ads</DrawerHeader>
//           <DrawerBody>
//             {acceptedAds.length === 0 ? (
//               <Text>No accepted ads yet.</Text>
//             ) : (
//               acceptedAds.map((ad) => (
//                 <Box key={ad._id} p={4} mb={4} bg="gray.100" borderRadius="md">
//                   <Text fontWeight="bold">{ad.title}</Text>
//                   <Text>{ad.description}</Text>
//                   <Text>Budget: ${ad.budget}</Text>
//                   <Text>Category: {ad.category}</Text>
//                   <Text>Posted by: {ad.companyId.name}</Text>
//                   {ad.proof && ad.proof.submittedAt ? (
//                     <Box mt={2}>
//                       <Text fontWeight="bold">Proof Submitted:</Text>
//                       <Text>
//                         Link:{' '}
//                         <a href={ad.proof.link} target="_blank" rel="noopener noreferrer">
//                           {ad.proof.link}
//                         </a>
//                       </Text>
//                       <Text>Description: {ad.proof.description}</Text>
//                       <Text>
//                         Submitted At:{' '}
//                         {new Date(ad.proof.submittedAt).toLocaleDateString()}
//                       </Text>
//                     </Box>
//                   ) : (
//                     <Button mt={2} colorScheme="blue" onClick={() => setSelectedAd(ad)}>
//                       Submit Proof
//                     </Button>
//                   )}
//                   {selectedAd && selectedAd._id === ad._id && (
//                     <Box mt={4}>
//                       <FormControl>
//                         <FormLabel>Link to Posted Content</FormLabel>
//                         <Input
//                           value={proofData.link}
//                           onChange={(e) =>
//                             setProofData({ ...proofData, link: e.target.value })
//                           }
//                           placeholder="https://example.com"
//                         />
//                       </FormControl>
//                       <FormControl mt={2}>
//                         <FormLabel>Description</FormLabel>
//                         <Textarea
//                           value={proofData.description}
//                           onChange={(e) =>
//                             setProofData({ ...proofData, description: e.target.value })
//                           }
//                           placeholder="Describe the content you posted"
//                         />
//                       </FormControl>
//                       <Button mt={2} colorScheme="green" onClick={() => handleSubmitProof(ad._id)}>
//                         Submit Proof
//                       </Button>
//                       <Button mt={2} ml={2} onClick={() => setSelectedAd(null)}>
//                         Cancel
//                       </Button>
//                     </Box>
//                   )}
//                 </Box>
//               ))
//             )}
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>
//       <Footer />
//     </>
//   );
// }

// export default InfluencerDashboard;

// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Heading,
//   Text,
//   Button,
//   VStack,
//   HStack,
//   IconButton,
//   useToast,
//   Drawer,
//   DrawerBody,
//   DrawerHeader,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerCloseButton,
//   useDisclosure,
//   FormControl,
//   FormLabel,
//   Input,
//   Textarea,
// } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom';
// import { FaUserEdit, FaBars } from 'react-icons/fa';
// import axios from 'axios';
// import Navbar from '../components/Navbar.jsx';
// import Footer from '../components/Footer.jsx';
// import { useAuth } from '../contexts/AuthContext.jsx';

// function InfluencerDashboard() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const toast = useToast();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [ads, setAds] = useState([]);
//   const [acceptedAds, setAcceptedAds] = useState([]);
//   const [proofData, setProofData] = useState({ link: '', description: '' });
//   const [selectedAd, setSelectedAd] = useState(null);

//   useEffect(() => {
//     const fetchAds = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('http://localhost:5001/api/ads', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAds(res.data);
//       } catch (err) {
//         console.error('Error fetching ads:', err);
//       }
//     };

//     const fetchAcceptedAds = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('http://localhost:5001/api/ads/accepted', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAcceptedAds(res.data);
//       } catch (err) {
//         console.error('Error fetching accepted ads:', err);
//       }
//     };

//     fetchAds();
//     fetchAcceptedAds();
//   }, []);

//   const handleAcceptAd = async (adId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         `http://localhost:5001/api/ads/${adId}/accept`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setAds(ads.filter((ad) => ad._id !== adId));
//       const res = await axios.get('http://localhost:5001/api/ads/accepted', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAcceptedAds(res.data);
//       toast({
//         title: 'Ad Accepted',
//         description: 'The ad has been accepted successfully.',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });
//     } catch (err) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.message || 'Failed to accept ad',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   const handleSubmitProof = async (adId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         `http://localhost:5001/api/ads/${adId}/submit-proof`,
//         proofData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const res = await axios.get('http://localhost:5001/api/ads/accepted', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setAcceptedAds(res.data);
//       setProofData({ link: '', description: '' });
//       setSelectedAd(null);
//       toast({
//         title: 'Proof Submitted',
//         description: 'Your proof has been submitted successfully.',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//       });
//     } catch (err) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.message || 'Failed to submit proof',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <Box minH="calc(100vh - 160px)" p={6} bg="gray.50">
//         <HStack justify="space-between" mb={6}>
//           <HStack>
//             <IconButton
//               icon={<FaBars />}
//               colorScheme="blue"
//               onClick={onOpen}
//               aria-label="Open Sidebar"
//             />
//             <Heading size="lg" color="blue.600">Influencer Dashboard</Heading>
//           </HStack>
//           <IconButton
//             icon={<FaUserEdit />}
//             colorScheme="blue"
//             onClick={() => navigate('/influencer/profile')}
//             aria-label="Edit Profile"
//           />
//         </HStack>
//         <VStack spacing={4} align="stretch">
//           <Text fontSize="xl">Welcome, {user.name}!</Text>
//           <Text fontSize="lg">
//             Ad Feed (Matching Your Categories: {user.categories.join(', ')})
//           </Text>
//           {ads.length === 0 ? (
//             <Text>No ads available in your categories.</Text>
//           ) : (
//             ads.map((ad) => (
//               <Box key={ad._id} p={4} bg="white" borderRadius="md" boxShadow="md">
//                 <Text fontWeight="bold">{ad.title}</Text>
//                 <Text>{ad.description}</Text>
//                 <Text>Budget: ${ad.budget}</Text>
//                 <Text>Category: {ad.category}</Text>
//                 <Text>Posted by: {ad.companyId.name}</Text>
//                 <Button mt={2} colorScheme="blue" onClick={() => handleAcceptAd(ad._id)}>
//                   Accept Ad
//                 </Button>
//               </Box>
//             ))
//           )}
//         </VStack>
//       </Box>
//       <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
//         <DrawerOverlay />
//         <DrawerContent>
//           <DrawerCloseButton />
//           <DrawerHeader>Accepted Ads</DrawerHeader>
//           <DrawerBody>
//             {acceptedAds.length === 0 ? (
//               <Text>No accepted ads yet.</Text>
//             ) : (
//               acceptedAds.map((ad) => (
//                 <Box key={ad._id} p={4} mb={4} bg="gray.100" borderRadius="md">
//                   <Text fontWeight="bold">{ad.title}</Text>
//                   <Text>{ad.description}</Text>
//                   <Text>Budget: ${ad.budget}</Text>
//                   <Text>Category: {ad.category}</Text>
//                   <Text>Posted by: {ad.companyId.name}</Text>
//                   {ad.proof && ad.proof.submittedAt ? (
//                     <Box mt={2}>
//                       <Text fontWeight="bold">Proof Submitted:</Text>
//                       <Text>
//                         Link:{' '}
//                         <a href={ad.proof.link} target="_blank" rel="noopener noreferrer">
//                           {ad.proof.link}
//                         </a>
//                       </Text>
//                       <Text>Description: {ad.proof.description}</Text>
//                       <Text>
//                         Submitted At:{' '}
//                         {new Date(ad.proof.submittedAt).toLocaleDateString()}
//                       </Text>
//                     </Box>
//                   ) : (
//                     <Button mt={2} colorScheme="blue" onClick={() => setSelectedAd(ad)}>
//                       Submit Proof
//                     </Button>
//                   )}
//                   {selectedAd && selectedAd._id === ad._id && (
//                     <Box mt={4}>
//                       <FormControl>
//                         <FormLabel>Link to Posted Content</FormLabel>
//                         <Input
//                           value={proofData.link}
//                           onChange={(e) =>
//                             setProofData({ ...proofData, link: e.target.value })
//                           }
//                           placeholder="https://example.com"
//                         />
//                       </FormControl>
//                       <FormControl mt={2}>
//                         <FormLabel>Description</FormLabel>
//                         <Textarea
//                           value={proofData.description}
//                           onChange={(e) =>
//                             setProofData({ ...proofData, description: e.target.value })
//                           }
//                           placeholder="Describe the content you posted"
//                         />
//                       </FormControl>
//                       <Button mt={2} colorScheme="green" onClick={() => handleSubmitProof(ad._id)}>
//                         Submit Proof
//                       </Button>
//                       <Button mt={2} ml={2} onClick={() => setSelectedAd(null)}>
//                         Cancel
//                       </Button>
//                     </Box>
//                   )}
//                 </Box>
//               ))
//             )}
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>
//       <Footer />
//     </>
//   );
// }

// export default InfluencerDashboard;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  IconButton,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaBars } from 'react-icons/fa';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function InfluencerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ads, setAds] = useState([]);
  const [acceptedAds, setAcceptedAds] = useState([]);
  const [proofData, setProofData] = useState({ link: '', description: '' });
  const [selectedAd, setSelectedAd] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/ads', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAds(res.data);
      } catch (err) {
        console.error('Error fetching ads:', err);
      }
    };

    const fetchAcceptedAds = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/ads/accepted', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAcceptedAds(res.data);
      } catch (err) {
        console.error('Error fetching accepted ads:', err);
      }
    };

    fetchAds();
    fetchAcceptedAds();
  }, []);

  const handleAcceptAd = async (adId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5001/api/ads/${adId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAds(ads.filter((ad) => ad._id !== adId));
      const res = await axios.get('http://localhost:5001/api/ads/accepted', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAcceptedAds(res.data);
      toast({
        title: 'Ad Accepted',
        description: 'The ad has been accepted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to accept ad',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmitProof = async (adId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5001/api/ads/${adId}/submit-proof`,
        proofData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res = await axios.get('http://localhost:5001/api/ads/accepted', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAcceptedAds(res.data);
      setProofData({ link: '', description: '' });
      setSelectedAd(null);
      toast({
        title: 'Proof Submitted',
        description: 'Your proof has been submitted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to submit proof',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Navbar />
      <Box minH="calc(100vh - 160px)" p={6} bgGradient="linear(to-br, gray.50, gray.100)">
        <HStack justify="space-between" mb={6}>
          <HStack>
            <IconButton
              icon={<FaBars />}
              colorScheme="orange"
              onClick={onOpen}
              aria-label="Open Sidebar"
              boxShadow="md"
              _hover={{ transform: 'scale(1.05)', bg: 'orange.400', color: 'white' }}
              transition="all 0.2s"
            />
            <Heading size="lg" color="orange.600">Influencer Dashboard</Heading>
          </HStack>
          <IconButton
            icon={<FaUserEdit />}
            colorScheme="orange"
            onClick={() => navigate('/influencer/profile')}
            aria-label="Edit Profile"
            boxShadow="md"
            _hover={{ transform: 'scale(1.05)', bg: 'orange.400', color: 'white' }}
            transition="all 0.2s"
          />
        </HStack>

        <VStack spacing={5} align="stretch">
          <Text fontSize="xl" fontWeight="semibold" color="gray.700">
            Welcome, <Text as="span" color="orange.600">{user.name}</Text>!
          </Text>
          <Text fontSize="lg" color="gray.600">
            Ad Feed (Matching Your Categories:{' '}
            <Text as="span" fontWeight="medium" color="orange.500">
              {user.categories.join(', ')}
            </Text>
            )
          </Text>
          {ads.length === 0 ? (
            <Text>No ads available in your categories.</Text>
          ) : (
            ads.map((ad) => (
              <Box
                key={ad._id}
                p={5}
                bg="white"
                borderRadius="lg"
                boxShadow="md"
                _hover={{ boxShadow: 'xl', transform: 'scale(1.01)', bg: 'orange.50' }}
                transition="all 0.2s"
              >
                <Text fontSize="xl" fontWeight="bold" color="orange.600">{ad.title}</Text>
                <Text mt={1} color="gray.700">{ad.description}</Text>
                <Text mt={1}><b>Budget:</b> ${ad.budget}</Text>
                <Text><b>Category:</b> {ad.category}</Text>
                <Text><b>Posted by:</b> {ad.companyId.name}</Text>
                <Button
                  mt={3}
                  colorScheme="orange"
                  onClick={() => handleAcceptAd(ad._id)}
                  _hover={{ bg: 'orange.500' }}
                >
                  Accept Ad
                </Button>
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
            {acceptedAds.length === 0 ? (
              <Text>No accepted ads yet.</Text>
            ) : (
              acceptedAds.map((ad) => (
                <Box
                  key={ad._id}
                  p={4}
                  mb={4}
                  bg="gray.100"
                  borderRadius="md"
                  boxShadow="sm"
                  _hover={{ boxShadow: 'md', bg: 'orange.100' }}
                  transition="all 0.2s"
                >
                  <Text fontWeight="bold" color="orange.600">{ad.title}</Text>
                  <Text>{ad.description}</Text>
                  <Text><b>Budget:</b> ${ad.budget}</Text>
                  <Text><b>Category:</b> {ad.category}</Text>
                  <Text><b>Posted by:</b> {ad.companyId.name}</Text>
                  {ad.proof && ad.proof.submittedAt ? (
                    <Box mt={2}>
                      <Text fontWeight="bold">Proof Submitted:</Text>
                      <Text>
                        Link:{' '}
                        <a
                          href={ad.proof.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'blue' }}
                        >
                          {ad.proof.link}
                        </a>
                      </Text>
                      <Text>Description: {ad.proof.description}</Text>
                      <Text>Submitted At: {new Date(ad.proof.submittedAt).toLocaleDateString()}</Text>
                    </Box>
                  ) : (
                    <Button mt={2} colorScheme="orange" onClick={() => setSelectedAd(ad)}>
                      Submit Proof
                    </Button>
                  )}
                  {selectedAd && selectedAd._id === ad._id && (
                    <Box mt={4}>
                      <FormControl>
                        <FormLabel>Link to Posted Content</FormLabel>
                        <Input
                          value={proofData.link}
                          onChange={(e) => setProofData({ ...proofData, link: e.target.value })}
                          placeholder="https://example.com"
                          bg="white"
                        />
                      </FormControl>
                      <FormControl mt={2}>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          value={proofData.description}
                          onChange={(e) => setProofData({ ...proofData, description: e.target.value })}
                          placeholder="Describe the content you posted"
                          bg="white"
                        />
                      </FormControl>
                      <HStack mt={3}>
                        <Button colorScheme="orange" onClick={() => handleSubmitProof(ad._id)}>
                          Submit Proof
                        </Button>
                        <Button onClick={() => setSelectedAd(null)}>Cancel</Button>
                      </HStack>
                    </Box>
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

export default InfluencerDashboard;

