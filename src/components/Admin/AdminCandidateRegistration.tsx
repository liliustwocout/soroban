import { Box, Button, Card, CardBody, CardHeader, Heading, Input, Textarea, VStack, useToast, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useAppContext } from "@/context/appContext";

const AdminCandidateRegistration = () => {
    const { adminToken } = useAppContext();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const toast = useToast();

    const handleRegister = async () => {
        if (!name.trim()) {
            toast({
                title: "Name required",
                description: "Please enter a candidate name",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsRegistering(true);
        try {
            const response = await fetch('http://localhost:5000/api/admin/candidates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`,
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
                // Clear form
                setName("");
                setDescription("");
            } else {
                toast({
                    title: "Registration failed",
                    description: data.error || "Failed to register candidate",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Error registering candidate:", error);
            toast({
                title: "Registration error",
                description: "Failed to register candidate",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <Box p={6}>
            <VStack spacing={6} align="stretch">
                <Heading size="lg">Register New Candidate</Heading>

                <Card>
                    <CardHeader>
                        <Heading size="md">Candidate Information</Heading>
                        <Text color="gray.600">Add a new candidate to the election</Text>
                    </CardHeader>
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <Input
                                placeholder="Candidate Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                size="lg"
                            />
                            <Textarea
                                placeholder="Candidate Description / Manifesto"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                size="lg"
                            />
                            <Button
                                colorScheme="green"
                                onClick={handleRegister}
                                isLoading={isRegistering}
                                loadingText="Registering..."
                                size="lg"
                                isDisabled={!name.trim()}
                            >
                                Register Candidate
                            </Button>
                        </VStack>
                    </CardBody>
                </Card>
            </VStack>
        </Box>
    );
};

export default AdminCandidateRegistration;
