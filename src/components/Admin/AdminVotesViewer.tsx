import { Box, Card, CardBody, CardHeader, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, VStack, Badge } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/appContext";

interface Vote {
  walletAddress: string;
  hasVoted: boolean;
  voteCandidateId: number | null;
  candidateName: string | null;
  createdAt: string;
}

const AdminVotesViewer = () => {
  const { adminToken } = useAppContext();
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/admin/votes", {
        headers: {
          "Authorization": `Bearer ${adminToken}`,
        },
      });
      const data = await response.json();
      if (data.votes) {
        setVotes(data.votes);
      }
    } catch (error) {
      console.error("Error Fetching Votes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box p={6}>
        <Text>Loading Votes...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">All Votes</Heading>
        <Card>
          <CardHeader>
            <Heading size="md">Vote Records</Heading>
            <Text color="gray.600">Complete List Of All Votes Cast In The Election</Text>
          </CardHeader>
          <CardBody>
            {votes.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Wallet Address</Th>
                    <Th>Status</Th>
                    <Th>Candidate Voted For</Th>
                    <Th>Vote Time</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {votes.map((vote, index) => (
                    <Tr key={index}>
                      <Td fontFamily="mono" fontSize="sm">
                        {vote.walletAddress}
                      </Td>
                      <Td>
                        <Badge colorScheme={vote.hasVoted ? "green" : "red"}>
                          {vote.hasVoted ? "Voted" : "Not Voted"}
                        </Badge>
                      </Td>
                      <Td>
                        {vote.candidateName || "N/A"}
                      </Td>
                      <Td>
                        {new Date(vote.createdAt).toLocaleString()}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text>No Votes Have Been Cast Yet!</Text>
            )}
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default AdminVotesViewer;