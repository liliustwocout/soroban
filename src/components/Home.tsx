import { Box, Heading, Text, VStack, Card, CardBody, List, ListItem, ListIcon, Button, Flex } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box p={6} maxW="4xl" mx="auto">
      <VStack spacing={8} align="stretch">
        <Box textAlign="center" py={10}>
          <Heading size="2xl" color="blue.600" mb={4}>
            Welcome To StellarVote
          </Heading>
          <Text fontSize="xl" color="gray.600" mb={6}>
            A Secure, Transparent, And Decentralized Blockchain-Based Election System Built On Stellar
          </Text>
          <Button as={Link} to="/Vote" colorScheme="blue" size="lg">
            Start Voting Now
          </Button>
        </Box>
        <Card>
          <CardBody>
            <Heading size="lg" mb={6} textAlign="center">
              Why Choose StellarVote?
            </Heading>
            <List spacing={4}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text fontSize="lg">
                  <strong>Blockchain Security:</strong> Every Vote Is Recorded On The Stellar Blockchain, Ensuring Immutability And Transparency
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text fontSize="lg">
                  <strong>Wallet Integration:</strong> Connect Your Stellar Wallet To Participate Securely Without Traditional Login Credentials
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text fontSize="lg">
                  <strong>Real-Time Results:</strong> View Live Election Results With Vote Counts And Candidate Standings
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text fontSize="lg">
                  <strong>Admin Dashboard:</strong> Comprehensive Admin Tools For Managing Candidates, Viewing Votes, And Overseeing Elections
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                <Text fontSize="lg">
                  <strong>Smart Contracts:</strong> Powered By Soroban Smart Contracts For Automated And Trustless Election Processes
                </Text>
              </ListItem>
            </List>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Heading size="lg" mb={6} textAlign="center">
              How It Works
            </Heading>
            <VStack spacing={6} align="stretch">
              <Flex direction={{ base: "column", md: "row" }} align="center" gap={4}>
                <Box flex="1" textAlign="center">
                  <Box bg="blue.100" borderRadius="full" w="60px" h="60px" display="inline-flex" alignItems="center" justifyContent="center" mb={3}>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">1</Text>
                  </Box>
                  <Heading size="md" mb={2}>Connect Wallet</Heading>
                  <Text>Connect Your Stellar Wallet (Freighter) To Authenticate And Participate In Elections</Text>
                </Box>
                <Box flex="1" textAlign="center">
                  <Box bg="blue.100" borderRadius="full" w="60px" h="60px" display="inline-flex" alignItems="center" justifyContent="center" mb={3}>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">2</Text>
                  </Box>
                  <Heading size="md" mb={2}>Browse Candidates</Heading>
                  <Text>View All Registered Candidates And Their Information Before Making Your Choice</Text>
                </Box>
                <Box flex="1" textAlign="center">
                  <Box bg="blue.100" borderRadius="full" w="60px" h="60px" display="inline-flex" alignItems="center" justifyContent="center" mb={3}>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">3</Text>
                  </Box>
                  <Heading size="md" mb={2}>Cast Your Vote</Heading>
                  <Text>Submit Your Vote Securely Through The Blockchain - Each Wallet Can Only Vote Once</Text>
                </Box>
              </Flex>
            </VStack>
          </CardBody>
        </Card>
        <Box textAlign="center" py={8}>
          <Heading size="lg" mb={4}>
            Ready To Make Your Voice Heard?
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={6}>
            Join The Future Of Democratic Voting With Blockchain Technology
          </Text>
          <Flex gap={4} justify="center" wrap="wrap">
            <Button as={Link} to="/Vote" colorScheme="blue" size="lg">
              Vote Now
            </Button>
            <Button as={Link} to="/Results" variant="outline" size="lg">
              View Results
            </Button>
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
};

export default Home;