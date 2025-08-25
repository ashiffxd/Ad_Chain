import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, VStack, Text, HStack, Select as ChakraSelect, Textarea, Wrap, WrapItem } from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    contactInfo: '',
    industry: '',
    companySize: '',
    website: '',
    socialMedia: [],
    description: '',
    categories: [],
  });

  const [error, setError] = useState('');
  const [newPlatform, setNewPlatform] = useState({ platform: '', followers: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoriesList = [
  'Fashion',
  'Fitness',
  'Travel',
  'Tech',
  'Food',
  'Beauty',
  'Lifestyle',
  'Gaming',
  'Health & Wellness',
  'Finance'
];

const companyIndustries = [
  'Technology',
  'Fashion',
  'Beauty',
  'Fitness',
  'Travel',
  'Food & Beverage',
  'Gaming',
  'Lifestyle',
  'Healthcare',
  'Finance'
];

  const companySizes = ['Small (1-50 employees)', 'Medium (51-200 employees)', 'Large (201+ employees)'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleAddPlatform = () => {
    if (!newPlatform.platform || !newPlatform.followers) {
      setError('Please select a platform and enter follower count');
      return;
    }
    if (formData.socialMedia.some((sm) => sm.platform === newPlatform.platform)) {
      setError('This platform is already added');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      socialMedia: [
        ...prev.socialMedia,
        { platform: newPlatform.platform, followers: parseInt(newPlatform.followers) },
      ],
    }));
    setNewPlatform({ platform: '', followers: '' });
    setError('');
  };

  const handleRemovePlatform = (index) => {
    const updatedSocialMedia = formData.socialMedia.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, socialMedia: updatedSocialMedia }));
  };

  const validateForm = () => {
    if (!formData.role) return 'Please select a role';
    if (!formData.name) return 'Name is required';
    if (!formData.email) return 'Email is required';
    if (!formData.email.includes('@')) return 'Invalid email format';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (!formData.contactInfo) return 'Contact information is required';
    if (formData.role === 'influencer') {
      if (!formData.socialMedia.length) return 'At least one social media platform is required';
      if (!formData.categories.length) return 'At least one category is required';
    }
    if (formData.role === 'company') {
      if (!formData.industry) return 'Industry is required';
      if (!formData.companySize) return 'Company size is required';
    }
    return '';
  };

  const handleSubmit = async () => {
    try {
      setError('');
      setIsSubmitting(true);

      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting form data:', formData);
      const user = await signup(formData);

      if (user.role === 'influencer') {
        navigate('/influencer/dashboard');
      } else {
        navigate('/company/dashboard');
      }
    } catch (err) {
      console.error('Signup error:', err.response || err);
      const errorMsg = err.message.includes('already exists')
        ? 'This email is already registered'
        : err.message.includes('password')
        ? 'Password does not meet requirements'
        : err.message || 'Failed to signup';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box minH="calc(100vh - 160px)" p={6} bg="gray.50" display="flex" justifyContent="center">
        <Box p={6} bg="white" borderRadius="md" boxShadow="md" w="full" maxW="md">
          <VStack spacing={4}>
            <Text fontSize="2xl" fontWeight="bold">Signup</Text>
            {error && <Text color="red.500">{error}</Text>}

            <FormControl>
              <FormLabel>Role</FormLabel>
              <ChakraSelect name="role" value={formData.role} onChange={handleChange} placeholder="Select role">
                <option value="influencer">Influencer</option>
                <option value="company">Company</option>
              </ChakraSelect>
            </FormControl>

            <FormControl>
              <FormLabel>{formData.role === 'company' ? 'Company Name' : 'Name'}</FormLabel>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Contact Information (Phone)</FormLabel>
              <Input type="tel" name="contactInfo" value={formData.contactInfo} onChange={handleChange} />
            </FormControl>

            {formData.role === 'company' && (
              <>
                <FormControl>
                  <FormLabel>Industry</FormLabel>
                  <ChakraSelect name="industry" value={formData.industry} onChange={handleChange} placeholder="Select industry">
                    {companyIndustries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </ChakraSelect>
                </FormControl>

                <FormControl>
                  <FormLabel>Company Size</FormLabel>
                  <ChakraSelect name="companySize" value={formData.companySize} onChange={handleChange} placeholder="Select size">
                    {companySizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </ChakraSelect>
                </FormControl>

                <FormControl>
                  <FormLabel>Website</FormLabel>
                  <Input type="url" name="website" value={formData.website} onChange={handleChange} />
                </FormControl>
              </>
            )}

            {formData.role === 'influencer' && (
              <>
                <FormControl>
                  <FormLabel>Social Media Platforms</FormLabel>
                  {formData.socialMedia.map((sm, index) => (
                    <HStack key={index} spacing={2} mb={2}>
                      <Input value={sm.platform} isReadOnly />
                      <Input value={sm.followers} isReadOnly />
                      <Button colorScheme="red" onClick={() => handleRemovePlatform(index)}>Remove</Button>
                    </HStack>
                  ))}
                  <HStack spacing={2}>
                    <ChakraSelect
                      value={newPlatform.platform}
                      onChange={(e) => setNewPlatform((prev) => ({ ...prev, platform: e.target.value }))}
                      placeholder="Select Platform"
                    >
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="TikTok">TikTok</option>
                    </ChakraSelect>
                    <Input
                      type="number"
                      value={newPlatform.followers}
                      onChange={(e) => setNewPlatform((prev) => ({ ...prev, followers: e.target.value }))}
                      placeholder="Followers"
                    />
                    <Button onClick={handleAddPlatform} colorScheme="brand">Add</Button>
                  </HStack>
                </FormControl>

                <FormControl>
                  <FormLabel>Categories (Your choice of ad types) Max 3</FormLabel>
                  <Wrap>
                    {categoriesList.map((cat) => (
                      <WrapItem key={cat}>
                        <Button
                          size="sm"
                          variant={formData.categories.includes(cat) ? 'solid' : 'outline'}
                          colorScheme="brand"
                          onClick={() => handleCategoryToggle(cat)}
                        >
                          {cat}
                        </Button>
                      </WrapItem>
                    ))}
                  </Wrap>
                </FormControl>
              </>
            )}

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea name="description" value={formData.description} onChange={handleChange} />
            </FormControl>

            <Button
              colorScheme="brand"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Signup
            </Button>

            <Text fontSize="sm">
              Already have an account?{' '}
              <Button
                variant="link"
                colorScheme="blue"
                as={RouterLink}
                to="/login"
              >
                Login
              </Button>
            </Text>

          </VStack>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default Signup;
