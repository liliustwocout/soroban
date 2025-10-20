import { Box, Card, CardBody, CardHeader, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, VStack, Badge } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/appContext";

interface Vote {
    wallet_address: string;
    has_voted: boolean;
    vote_candidate_id: number | null;
    candidate_name: string | null;
    created_at: string;
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
            const response = await fetch('http://localhost:5000/api/admin/votes', {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                },
            });

            const data = await response.json();
            if (data.votes) {
                setVotes(data.votes);
            }
        } catch (error) {
            console.error('Error fetching votes:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box p={6}>
                <Text>Loading votes...</Text>
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
                        <Text color="gray.600">Complete list of all votes cast in the election</Text>
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
                                                {vote.wallet_address}
                                            </Td>
                                            <Td>
                                                <Badge colorScheme={vote.has_voted ? "green" : "red"}>
                                                    {vote.has_voted ? "Voted" : "Not Voted"}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                {vote.candidate_name || "N/A"}
                                            </Td>
                                            <Td>
                                                {new Date(vote.created_at).toLocaleString()}
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        ) : (
                            <Text>No votes have been cast yet.</Text>
                        )}
                    </CardBody>
                </Card>
            </VStack>
        </Box>
    );
};

export default AdminVotesViewer;
