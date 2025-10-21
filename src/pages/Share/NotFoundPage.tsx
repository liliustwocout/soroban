import { useNavigate } from "react-router-dom";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Stack,
} from "@chakra-ui/react";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Stack mt={20}>
      <Alert status="info">
        <AlertIcon />
        <AlertTitle>404</AlertTitle>
        <AlertDescription>You Have Found A Secret Place!</AlertDescription>
      </Alert>
      <Button onClick={() => navigate("/")}>Home</Button>
    </Stack>
  );
};