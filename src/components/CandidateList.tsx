import { Box, Button, Card, CardBody, CardHeader, Heading, Text, VStack, HStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAppContext } from "@/context/appContext";

const CandidateList = () => {
  const { candidates, setCandidates, walletAddress } = useAppContext();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/candidates");
        const data = await response.json();
        setCandidates(data.candidates);
      } catch (error) {
        console.error("Error Fetching Candidates:", error);
      }
    };
    fetchCandidates();
  }, [setCandidates]);

  return (
    <Box p={6}>
      <Heading mb={6}>Election Candidates</Heading>
      <VStack spacing={4} align="stretch">
        {candidates.map((candidate) => (
          <Card key={candidate.id}>
            <CardHeader>
              <Heading size="md">{candidate.name}</Heading>
            </CardHeader>
            <CardBody>
              <Text mb={4}>{candidate.description}</Text>
              <HStack justify="space-between">
                <Text fontWeight="bold">Votes: {candidate.vote_count}</Text>
                {walletAddress && (
                  <Button colorScheme="blue" size="sm" as="a" href="/Vote">
                    Vote
                  </Button>
                )}
              </HStack>
            </CardBody>
          </Card>
        ))}
        {candidates.length === 0 && (
          <Text>No Candidates Registered Yet!</Text>
        )}
      </VStack>
    </Box>
  );
};

export default CandidateList;