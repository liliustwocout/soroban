import { Box, Button, Card, CardBody, CardHeader, Heading, Input, Textarea, VStack, useToast, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useAppContext } from "@/context/appContext";

const RegisterCandidateForm = () => {
  const { walletAddress, setCandidates } = useAppContext();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const toast = useToast();

  const handleRegister = async () => {
    if (!name.trim() || !description.trim() || !walletAddress) return;
    setIsRegistering(true);
    try {
      const response = await fetch("http://localhost:3000/api/admin/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Candidate Registered Successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        const candidatesResponse = await fetch("http://localhost:3000/api/candidates");
        const candidatesData = await candidatesResponse.json();
        setCandidates(candidatesData.candidates);
        setName("");
        setDescription("");
      } else {
        toast({
          title: "Error Registering Candidate!",
          description: data.error || "Please Try Again!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error Registering Candidate:", error);
      toast({
        title: "Error Registering Candidate!",
        description: "Please Try Again!",
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
        <Text>Please Connect Your Wallet To Register As A Candidate!</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6}>Register As Candidate</Heading>
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