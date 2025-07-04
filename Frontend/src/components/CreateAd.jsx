import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Textarea, Select, Button, VStack, Text } from '@chakra-ui/react';
import axios from 'axios';

function CreateAd({ onAdCreated }) {
  const [adData, setAdData] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
  });
  const [error, setError] = useState('');

  const categories = ['Fashion', 'Fitness', 'Travel', 'Tech', 'Food'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/ads', adData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onAdCreated();
      setAdData({ title: '', description: '', budget: '', category: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ad');
    }
  };

  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="md">
      <VStack spacing={4}>
        <Text fontSize="xl" fontWeight="bold">Create Ad</Text>
        {error && <Text color="red.500">{error}</Text>}
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input name="title" value={adData.title} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea name="description" value={adData.description} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Budget ($)</FormLabel>
          <Input type="number" name="budget" value={adData.budget} onChange={handleChange} />
        </FormControl>
        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select name="category" value={adData.category} onChange={handleChange} placeholder="Select category">
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </FormControl>
        <Button colorScheme="brand" onClick={handleSubmit}>Create Ad</Button>
      </VStack>
    </Box>
  );
}

export default CreateAd;