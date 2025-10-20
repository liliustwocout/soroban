import { Box, Card, CardBody, CardHeader, Heading, Text, VStack, Progress } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAppContext } from "@/context/appContext";

const ElectionResults = () => {
    const { candidates, setCandidates } = useAppContext();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/candidates');
                const data = await response.json();
                console.log("Election results data:", data); // Debug log
                setCandidates(data.candidates);
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        };

        fetchResults();
    }, [setCandidates]);

    const totalVotes = candidates.length > 0 ? candidates.reduce((sum, candidate) => sum + parseInt(candidate.vote_count || 0), 0) : 0;

    return (
        <Box p={6}>
            <Heading mb={6}>Election Results</Heading>
            <Text mb={4} fontSize="lg">Total Votes Cast: {totalVotes}</Text>
            <VStack spacing={4} align="stretch">
                {candidates
                    .sort((a, b) => parseInt(b.vote_count || 0) - parseInt(a.vote_count || 0))
                    .map((candidate, index) => {
                        const voteCount = parseInt(candidate.vote_count || 0);
                        return (
                            <Card key={candidate.id}>
                                <CardHeader>
                                    <Heading size="md">
                                        #{index + 1} - {candidate.name}
                                    </Heading>
                                </CardHeader>
                                <CardBody>
                                    <Text mb={2}>{candidate.description}</Text>
                                    <Text fontWeight="bold" mb={2} fontSize="lg">
                                        Votes Received: {voteCount}
                                    </Text>
                                    <Text mb={2} color="gray.600">
                                        Percentage: {totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(1) : 0}%
                                    </Text>
                                    <Progress
                                        value={totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0}
                                        colorScheme="blue"
                                        size="lg"
                                    />
                                </CardBody>
                            </Card>
                        );
                    })}
                {candidates.length === 0 && (
                    <Text>No results available yet.</Text>
                )}
            </VStack>
        </Box>
    );
};

export default ElectionResults;
