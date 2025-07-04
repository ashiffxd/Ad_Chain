// import React from 'react';
// import { Box } from '@chakra-ui/react';

// const Footer = () => (
//   <Box
//     textAlign="center"
//     p={4}
//     bg="blue.100"
//     color="gray.600"
//     fontSize="sm"
//     borderTop="1px solid #ccc"
//   >
//     © {new Date().getFullYear()} AdSense Platform. All rights reserved.
//   </Box>
// );

// export default Footer;
import React from 'react';
import { 
  Box, 
  Container, 
  Input, 
  Textarea, 
  FormControl, 
  FormLabel, 
  VStack, 
  Text, 
  Button, 
  Flex, 
  Heading 
} from '@chakra-ui/react';

const Footer = () => (
  <Box bgGradient="linear(to-r, red.400, orange.400)" color="white" py={10}>
    <Container maxW="6xl">
      <VStack spacing={8}>
        {/* Contact Form */}
        <Box w="100%" maxW="500px">
          <Heading as="h3" size="md" mb={6} textAlign="center">
            Get in Touch
          </Heading>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Your Name"
                bg="white"
                color="black"
                _placeholder={{ color: 'gray.500' }}
                focusBorderColor="orange.300"
                borderColor="white"
                _hover={{ borderColor: 'orange.300' }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="your.email@example.com"
                bg="white"
                color="black"
                _placeholder={{ color: 'gray.500' }}
                focusBorderColor="orange.300"
                borderColor="white"
                _hover={{ borderColor: 'orange.300' }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Message</FormLabel>
              <Textarea
                placeholder="Your message..."
                bg="white"
                color="black"
                _placeholder={{ color: 'gray.500' }}
                focusBorderColor="orange.300"
                borderColor="white"
                _hover={{ borderColor: 'orange.300' }}
                rows={4}
              />
            </FormControl>
            <Button
              w="full"
              bg="white"
              color="red.400"
              _hover={{ bg: 'orange.300', color: 'white' }}
              onClick={() => alert('Form submission simulated!')}
            >
              Send Message
            </Button>
          </VStack>
        </Box>

        {/* Quick Links */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="center"
          align="center"
          gap={6}
        >
          <Button variant="link" color="white" _hover={{ color: 'black' }}>
            Home
          </Button>
          <Button variant="link" color="white" _hover={{ color: 'black' }}>
            About
          </Button>
          <Button variant="link" color="white" _hover={{ color: 'black' }}>
            Contact
          </Button>
          <Button variant="link" color="white" _hover={{ color: 'black' }}>
            Privacy Policy
          </Button>
          <Button variant="link" color="white" _hover={{ color: 'black' }}>
            Terms of Service
          </Button>
        </Flex>

        {/* Copyright */}
        <Text fontSize="sm">
          © {new Date().getFullYear()} 🔺SENSE. All rights reserved.
        </Text>
      </VStack>
    </Container>
  </Box>
);

export default Footer;