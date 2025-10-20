import { Box, Button, Card, CardBody, CardHeader, Heading, Input, Textarea, VStack, useToast, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useAppContext } from "@/context/appContext";

const RegisterCandidateForm = () => {
    const { walletAddress, candidates, setCandidates } = useAppContext();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const toast = useToast();

    const handleRegister = async () => {
        if (!name.trim() || !description.trim() || !walletAddress) return;

        setIsRegistering(true);
        try {
            const response = await fetch('http://localhost:5000/api/admin/candidates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim(),
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Candidate registered successfully!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                // Refresh candidates list
                const candidatesResponse = await fetch('http://localhost:5000/api/candidates');
                const candidatesData = await candidatesResponse.json();
                setCandidates(candidatesData.candidates);
                // Clear form
                setName("");
                setDescription("");
            } else {
                toast({
                    title: "Error registering candidate",
                    description: data.error || "Please try again",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Error registering candidate:", error);
            toast({
                title: "Error registering candidate",
                description: "Please try again",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsRegistering(false);
        }
    };

    if (!walletAddress) {
        return (
            <Box p={6}>
                <Text>Please connect your wallet to register as a candidate.</Text>
            </Box>
        );
    }

    return (
        <Box p={6}>
            <Heading mb={6}>Register as Candidate</Heading>
            <Card>
                <CardHeader>
                    <Heading size="md">Candidate Information</Heading>
                </CardHeader>
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <Input
                            placeholder="Candidate Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Textarea
                            placeholder="Candidate Description / Manifesto"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                        <Button
                            colorScheme="green"
                            onClick={handleRegister}
                            isLoading={isRegistering}
                            loadingText="Registering..."
                            isDisabled={!name.trim() || !description.trim()}
                        >
                            Register Candidate
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        </Box>
    );
};

export default RegisterCandidateForm;
