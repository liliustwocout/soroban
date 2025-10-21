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
        title: "Name Required!",
        description: "Please Enter A Candidate Name!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsRegistering(true);
    try {
      const response = await fetch("http://localhost:3000/api/admin/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${adminToken}`,
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
        setName("");
        setDescription("");
      } else {
        toast({
          title: "Registration Failed!",
          description: data.error || "Failed To Register Candidate!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error Registering Candidate:", error);
      toast({
        title: "Registration Error!",
        description: "Failed To Register Candidate!",
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
            <Text color="gray.600">Add A New Candidate To The Election</Text>
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