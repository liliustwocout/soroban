import { Box, Heading, Text, VStack, Card, CardBody, List, ListItem, ListIcon, Button, Flex } from "@chakra-ui/react";
import { CheckCircleIcon, StarIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <Box p={6} maxW="4xl" mx="auto">
            <VStack spacing={8} align="stretch">
                {/* Hero Section */}
                <Box textAlign="center" py={10}>
                    <Heading size="2xl" color="blue.600" mb={4}>
                        Welcome to StellarVote
                    </Heading>
                    <Text fontSize="xl" color="gray.600" mb={6}>
                        A secure, transparent, and decentralized blockchain-based election system built on Stellar
                    </Text>
                    <Button as={Link} to="/vote" colorScheme="blue" size="lg">
                        Start Voting Now
                    </Button>
                </Box>

                {/* Features Section */}
                <Card>
                    <CardBody>
                        <Heading size="lg" mb={6} textAlign="center">
                            Why Choose StellarVote?
                        </Heading>
                        <List spacing={4}>
                            <ListItem>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text fontSize="lg">
                                    <strong>Blockchain Security:</strong> Every vote is recorded on the Stellar blockchain, ensuring immutability and transparency
                                </Text>
                            </ListItem>
                            <ListItem>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text fontSize="lg">
                                    <strong>Wallet Integration:</strong> Connect your Stellar wallet to participate securely without traditional login credentials
                                </Text>
                            </ListItem>
                            <ListItem>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text fontSize="lg">
                                    <strong>Real-time Results:</strong> View live election results with vote counts and candidate standings
                                </Text>
                            </ListItem>
                            <ListItem>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text fontSize="lg">
                                    <strong>Admin Dashboard:</strong> Comprehensive admin tools for managing candidates, viewing votes, and overseeing elections
                                </Text>
                            </ListItem>
                            <ListItem>
                                <ListIcon as={CheckCircleIcon} color="green.500" />
                                <Text fontSize="lg">
                                    <strong>Smart Contracts:</strong> Powered by Soroban smart contracts for automated and trustless election processes
                                </Text>
                            </ListItem>
                        </List>
                    </CardBody>
                </Card>

                {/* How It Works Section */}
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
                                    <Text>Connect your Stellar wallet (Freighter) to authenticate and participate in elections</Text>
                                </Box>
                                <Box flex="1" textAlign="center">
                                    <Box bg="blue.100" borderRadius="full" w="60px" h="60px" display="inline-flex" alignItems="center" justifyContent="center" mb={3}>
                                        <Text fontSize="2xl" fontWeight="bold" color="blue.600">2</Text>
                                    </Box>
                                    <Heading size="md" mb={2}>Browse Candidates</Heading>
                                    <Text>View all registered candidates and their information before making your choice</Text>
                                </Box>
                                <Box flex="1" textAlign="center">
                                    <Box bg="blue.100" borderRadius="full" w="60px" h="60px" display="inline-flex" alignItems="center" justifyContent="center" mb={3}>
                                        <Text fontSize="2xl" fontWeight="bold" color="blue.600">3</Text>
                                    </Box>
                                    <Heading size="md" mb={2}>Cast Your Vote</Heading>
                                    <Text>Submit your vote securely through the blockchain - each wallet can only vote once</Text>
                                </Box>
                            </Flex>
                        </VStack>
                    </CardBody>
                </Card>

                {/* Call to Action */}
                <Box textAlign="center" py={8}>
                    <Heading size="lg" mb={4}>
                        Ready to Make Your Voice Heard?
                    </Heading>
                    <Text fontSize="lg" color="gray.600" mb={6}>
                        Join the future of democratic voting with blockchain technology
                    </Text>
                    <Flex gap={4} justify="center" wrap="wrap">
                        <Button as={Link} to="/vote" colorScheme="blue" size="lg">
                            Vote Now
                        </Button>
                        <Button as={Link} to="/results" variant="outline" size="lg">
                            View Results
                        </Button>
                    </Flex>
                </Box>
            </VStack>
        </Box>
    );
};

export default Home;
