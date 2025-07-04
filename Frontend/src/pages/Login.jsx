import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, VStack, Text } from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError('');
      const user = await login(formData.email, formData.password);
      if (user.role === 'influencer') {
        navigate('/influencer/dashboard');
      } else {
        navigate('/company/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <Box minH="calc(100vh - 160px)" p={6} bg="gray.50" display="flex" justifyContent="center">
        <Box p={6} bg="white" borderRadius="md" boxShadow="md" w="full" maxW="md">
          <VStack spacing={4}>
            <Text fontSize="2xl" fontWeight="bold">Login</Text>
            {error && <Text color="red.500">{error}</Text>}
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} />
            </FormControl>
            <Button colorScheme="brand" onClick={handleSubmit}>Login</Button>
            <Text fontSize="sm">
              Don’t have an account?{' '}
              <Button
                variant="link"
                colorScheme="blue"
                as={RouterLink}
                to="/signup"
              >
                Signup
              </Button>
            </Text>
          </VStack>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default Login;
