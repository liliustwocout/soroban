import { Box, Card, CardBody, CardHeader, Heading, Text, VStack, Progress } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAppContext } from "@/context/appContext";
import { election } from "@/shared/contracts";

const ElectionResults = () => {
    const { candidates, setCandidates } = useAppContext();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const resultsData = await election.get_results();
                setCandidates(resultsData);
            } catch (error) {
                console.error("Error fetching results:", error);
            }
        };

        fetchResults();
    }, [setCandidates]);

    const totalVotes = candidates.length > 0 ? candidates.reduce((sum, candidate) => sum + candidate.vote_count, 0) : 0;

    return (
        <Box p={6}>
            <Heading mb={6}>Election Results</Heading>
            <Text mb={4} fontSize="lg">Total Votes: {totalVotes}</Text>
            <VStack spacing={4} align="stretch">
                {candidates
                    .sort((a, b) => b.vote_count - a.vote_count)
                    .map((candidate) => (
                        <Card key={candidate.id}>
                            <CardHeader>
                                <Heading size="md">{candidate.name}</Heading>
                            </CardHeader>
                            <CardBody>
                                <Text mb={2}>{candidate.description}</Text>
                                <Text fontWeight="bold" mb={2}>
                                    Votes: {candidate.vote_count} ({totalVotes > 0 ? ((candidate.vote_count / totalVotes) * 100).toFixed(1) : 0}%)
                                </Text>
                                <Progress
                                    value={totalVotes > 0 ? (candidate.vote_count / totalVotes) * 100 : 0}
                                    colorScheme="blue"
                                    size="lg"
                                />
                            </CardBody>
                        </Card>
                    ))}
                {candidates.length === 0 && (
                    <Text>No results available yet.</Text>
                )}
            </VStack>
        </Box>
    );
};

export default ElectionResults;
