import { Box, Card, CardBody, CardHeader, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, VStack, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/appContext";

interface DashboardStats {
  totalUsers: number;
  totalVotes: number;
  totalCandidates: number;
  voteDistribution: Array<{
    name: string;
    voteCount: number;
  }>;
}

const AdminDashboard = () => {
  const { adminToken } = useAppContext();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/dashboard", {
        headers: {
          "Authorization": `Bearer ${adminToken}`,
        },
      });
      const data = await response.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error Fetching Dashboard Stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box p={6}>
        <Text>Loading Dashboard...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Admin Dashboard</Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Users</StatLabel>
                <StatNumber>{stats?.totalUsers || 0}</StatNumber>
                <StatHelpText>Registered Wallet Addresses</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Votes</StatLabel>
                <StatNumber>{stats?.totalVotes || 0}</StatNumber>
                <StatHelpText>Votes Cast</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Candidates</StatLabel>
                <StatNumber>{stats?.totalCandidates || 0}</StatNumber>
                <StatHelpText>Available Candidates</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
        <Card>
          <CardHeader>
            <Heading size="md">Vote Distribution</Heading>
          </CardHeader>
          <CardBody>
            {stats?.voteDistribution && stats.voteDistribution.length > 0 ? (
              <VStack spacing={3} align="stretch">
                {stats.voteDistribution.map((candidate, index) => (
                  <Box key={index} p={3} borderWidth={1} borderRadius="md">
                    <Text fontWeight="bold">{candidate.name}</Text>
                    <Text color="gray.600">{candidate.voteCount} Votes</Text>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>No Votes Recorded Yet</Text>
            )}
          </CardBody>
        </Card>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Button colorScheme="blue" as="a" href="/Votes">
            View All Votes
          </Button>
          <Button colorScheme="green" as="a" href="/Register-Candidate">
            Register New Candidate
          </Button>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default AdminDashboard;