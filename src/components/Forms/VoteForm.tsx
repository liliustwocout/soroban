import { Box, Button, Card, CardBody, CardHeader, Heading, Radio, RadioGroup, Stack, Text, VStack, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/appContext";

const VoteForm = () => {
    const { candidates, setCandidates, walletAddress, hasVoted, setHasVoted } = useAppContext();
    const [selectedCandidate, setSelectedCandidate] = useState("");
    const [isVoting, setIsVoting] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/candidates');
                const data = await response.json();
                setCandidates(data.candidates);
            } catch (error) {
                console.error("Error fetching candidates:", error);
            }
        };

        const checkVoteStatus = async () => {
            if (walletAddress) {
                try {
                    const response = await fetch(`http://localhost:5000/api/auth/user-login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ walletAddress }),
                    });
                    const data = await response.json();
                    if (data.success) {
                        setHasVoted(data.user.hasVoted);
                    }
                } catch (error) {
                    console.error("Error checking vote status:", error);
                }
            }
        };

        fetchCandidates();
        checkVoteStatus();
    }, [setCandidates, setHasVoted, walletAddress]);

    const handleVote = async () => {
        if (!selectedCandidate || !walletAddress) return;

        setIsVoting(true);
        try {
            const response = await fetch('http://localhost:5000/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    walletAddress,
                    candidateId: parseInt(selectedCandidate),
                }),
            });

            const data = await response.json();

            if (data.success) {
                setHasVoted(true);
                toast({
                    title: "Vote submitted successfully!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                // Refresh candidates to show updated vote counts
                const candidatesResponse = await fetch('http://localhost:5000/api/candidates');
                const candidatesData = await candidatesResponse.json();
                setCandidates(candidatesData.candidates);
            } else {
                toast({
                    title: "Error submitting vote",
                    description: data.error || "Please try again",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Error voting:", error);
            toast({
                title: "Error submitting vote",
                description: "Please try again",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsVoting(false);
        }
    };

    if (!walletAddress) {
        return (
            <Box p={6}>
                <Text>Please connect your wallet to vote.</Text>
            </Box>
        );
    }

    if (hasVoted) {
        return (
            <Box p={6}>
                <Text>You have already voted in this election.</Text>
            </Box>
        );
    }

    return (
        <Box p={6}>
            <Heading mb={6}>Cast Your Vote</Heading>
            <Card>
                <CardHeader>
                    <Heading size="md">Select a Candidate</Heading>
                </CardHeader>
                <CardBody>
                    <RadioGroup onChange={setSelectedCandidate} value={selectedCandidate}>
                        <Stack direction="column">
                            {candidates.map((candidate) => (
                                <Radio key={candidate.id} value={candidate.id.toString()}>
                                    <VStack align="start" spacing={1}>
                                        <Text fontWeight="bold">{candidate.name}</Text>
                                        <Text fontSize="sm" color="gray.600">{candidate.description}</Text>
                                    </VStack>
                                </Radio>
                            ))}
                        </Stack>
                    </RadioGroup>
                    {candidates.length === 0 && (
                        <Text>No candidates available to vote for.</Text>
                    )}
                    <Button
                        mt={4}
                        colorScheme="blue"
                        onClick={handleVote}
                        isLoading={isVoting}
                        loadingText="Submitting Vote..."
                        isDisabled={!selectedCandidate}
                    >
                        Submit Vote
                    </Button>
                </CardBody>
            </Card>
        </Box>
    );
};

export default VoteForm;
