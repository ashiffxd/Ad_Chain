import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Avatar,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiSave } from 'react-icons/fi';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';
import {BACKEND_URL} from '../../config'; // ✅ imported config

const companyIndustries = [
  'Technology', 'Fashion', 'Beauty', 'Fitness', 'Travel',
  'Food & Beverage', 'Gaming', 'Lifestyle', 'Healthcare', 'Finance'
];

const companySizes = ['Small (1-50 employees)', 'Medium (51-200 employees)', 'Large (201+ employees)'];

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [companyProfile, setCompanyProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`${BACKEND_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCompanyProfile(res.data);
        setEditedProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      }
    };

    fetchProfile();
  }, [user]);

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const res = await axios.put(`${BACKEND_URL}/users/profile`, editedProfile, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCompanyProfile(res.data);
        setEditedProfile(res.data);
      } catch (err) {
        console.error('Error updating profile:', err);
        setError('Failed to update profile');
      }
    }
    setIsEditing(!isEditing);
  };

  const handleProfileChange = (field, value) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleBackToDashboard = () => {
    navigate('/company/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!companyProfile) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="brand.500" />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box minH="calc(100vh - 160px)" p={6} bg="gray.50">
        <Flex justify="space-between" align="center" mb={4}>
          <Flex align="center">
            <Avatar
              name={companyProfile.name}
              size="lg"
              bg="brand.500"
              color="white"
              mr={4}
            />
            <Heading size="lg" color="brand.500">{companyProfile.name}</Heading>
          </Flex>
          <IconButton
            icon={isEditing ? <FiSave /> : <FiEdit />}
            onClick={handleEditToggle}
            colorScheme={isEditing ? 'green' : 'brand'}
            aria-label={isEditing ? 'Save Profile' : 'Edit Profile'}
          />
        </Flex>
        {error && (
          <Text color="red.500" mb={4}>
            {error}
          </Text>
        )}
        <Box p={6} bg="white" borderRadius="md" boxShadow="md">
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Company Name</FormLabel>
              {isEditing ? (
                <Input
                  value={editedProfile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  focusBorderColor="brand.500"
                />
              ) : (
                <Text>{companyProfile.name}</Text>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Text>{companyProfile.email}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Text>{companyProfile.role.charAt(0).toUpperCase() + companyProfile.role.slice(1)}</Text>
            </FormControl>
            <FormControl>
              <FormLabel>Contact Information (Phone)</FormLabel>
              {isEditing ? (
                <Input
                  value={editedProfile.contactInfo}
                  onChange={(e) => handleProfileChange('contactInfo', e.target.value)}
                  type="tel"
                  focusBorderColor="brand.500"
                />
              ) : (
                <Text>{companyProfile.contactInfo}</Text>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Industry</FormLabel>
              {isEditing ? (
                <Select
                  value={editedProfile.industry}
                  onChange={(e) => handleProfileChange('industry', e.target.value)}
                  focusBorderColor="brand.500"
                >
                  {companyIndustries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </Select>
              ) : (
                <Text>{companyProfile.industry}</Text>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Company Size</FormLabel>
              {isEditing ? (
                <Select
                  value={editedProfile.companySize}
                  onChange={(e) => handleProfileChange('companySize', e.target.value)}
                  focusBorderColor="brand.500"
                >
                  {companySizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </Select>
              ) : (
                <Text>{companyProfile.companySize}</Text>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Website</FormLabel>
              {isEditing ? (
                <Input
                  value={editedProfile.website}
                  onChange={(e) => handleProfileChange('website', e.target.value)}
                  type="url"
                  focusBorderColor="brand.500"
                />
              ) : (
                <Text>{companyProfile.website}</Text>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              {isEditing ? (
                <Textarea
                  value={editedProfile.description}
                  onChange={(e) => handleProfileChange('description', e.target.value)}
                  focusBorderColor="brand.500"
                  rows={3}
                />
              ) : (
                <Text>{companyProfile.description}</Text>
              )}
            </FormControl>
          </VStack>
        </Box>
        <Flex mt={6} justify="center" gap={4}>
          <Button colorScheme="brand" onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>
          <Button colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      </Box>
      <Footer />
    </>
  );
};

export default CompanyProfile;
