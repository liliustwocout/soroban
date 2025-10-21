import { Box, Button, Card, CardBody, CardHeader, Heading, Input, VStack, Text, useToast, Tabs, TabList, TabPanels, Tab, TabPanel, FormControl, FormLabel } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/appContext";
import { StellarWalletsKit, WalletNetwork, ISupportedWallet } from "stellar-wallets-kit";
import { FREIGHTER_ID } from "stellar-wallets-kit/modules/freighter.module";
import { FreighterModule } from "stellar-wallets-kit/modules/freighter.module";

const Login = () => {
  const { setUserType, setWalletAddress, setHasVoted, setAdminToken } = useAppContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const toast = useToast();

  const FUTURENET_DETAILS = {
    network: "FUTURENET",
    networkUrl: "https://horizon-futurenet.stellar.org",
    networkPassphrase: "Test SDF Future Network ; October 2022",
  };

  const ERRORS = {
    WALLET_CONNECTION_REJECTED: "Wallet Connection Rejected!",
  };

  const STORAGE_WALLET_KEY = "wallet";
  const AllowedWallets = [FREIGHTER_ID];

  const [SelectedNetwork] = useState(FUTURENET_DETAILS);
  const [SWKKit] = useState(() => {
    return new StellarWalletsKit({
      network: SelectedNetwork.networkPassphrase as WalletNetwork,
      modules: [new FreighterModule()],
    });
  });

  const parseResponseSafe = async (res: Response): Promise<any> => {
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    try {
      if (ct.includes("application/json")) {
        return await res.json();
      }
      const text = await res.text();
      if (text && (text.trim().startsWith("{") || text.trim().startsWith("["))) {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      }
      return text || null;
    } catch {
      return null;
    }
  };

  const GetWalletAddress = async (productId: string) => {
    setIsConnecting(true);
    try {
      SWKKit.setWallet(productId);
      const { address: PublicKey } = await SWKKit.getAddress();

      const res = await fetch("http://localhost:3000/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: PublicKey }),
      });

      const data = await parseResponseSafe(res);

      if (!res.ok) {
        const message = (data && (data.error || data.message)) || (typeof data === "string" ? data : "Server Error");
        toast({
          title: "Login Failed!",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (data && data.success) {
        setWalletAddress(PublicKey);
        setHasVoted(!!data.user?.hasVoted);
        setUserType("user");
        localStorage.setItem(STORAGE_WALLET_KEY, productId);
        toast({
          title: "Wallet Connected Successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const message = (data && (data.error || data.message)) || "Failed To Authenticate User";
        toast({
          title: "Login Failed!",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("GetWalletAddress Error:", err);
      localStorage.removeItem(STORAGE_WALLET_KEY);
      toast({
        title: ERRORS.WALLET_CONNECTION_REJECTED,
        description: "",
        position: "bottom-right",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "subtle",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const StoredWallet = localStorage.getItem(STORAGE_WALLET_KEY);
    if (StoredWallet && AllowedWallets.includes(StoredWallet)) {
      (async () => {
        await GetWalletAddress(StoredWallet);
      })();
    }
  }, []);

  const ConnectWallet = async () => {
    if (!isConnecting) {
      await SWKKit.openModal({
        onWalletSelected: async (Option: ISupportedWallet) => {
          await GetWalletAddress(Option.id);
        },
      });
    }
  };

  const LoginAsAdmin = async () => {
    if (!adminCredentials.username || !adminCredentials.password) {
      toast({
        title: "Missing Credentials!",
        description: "Please Enter Both Username & Password!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminCredentials),
      });

      const data = await parseResponseSafe(res);

      if (!res.ok) {
        const message = (data && (data.error || data.message)) || (typeof data === "string" ? data : "Login Failed");
        toast({
          title: "Login Failed!",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (data && data.success) {
        setAdminToken(data.token);
        localStorage.setItem("adminToken", data.token);
        setUserType("admin");
        toast({
          title: "Admin Login Successful!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const message = (data && (data.error || data.message)) || (typeof data === "string" ? data : "Invalid Credentials");
        toast({
          title: "Login Failed!",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Admin Login Error:", err);
      toast({
        title: "Login Error!",
        description: "Failed To Login As Admin!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Box p={6} maxW="md" mx="auto">
      <Card>
        <CardHeader>
          <Heading size="lg" textAlign="center">
            StellarVote Login
          </Heading>
          <Text textAlign="center" color="gray.600" mt={2}>
            Choose Your Login Method
          </Text>
        </CardHeader>
        <CardBody>
          <Tabs variant="enclosed" defaultIndex={0}>
            <TabList>
              <Tab>Voter Login</Tab>
              <Tab>Admin Login</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <VStack spacing={4}>
                  <Text textAlign="center">
                    Connect Your Stellar Wallet To Participate In The Election
                  </Text>
                  <Button
                    colorScheme="blue"
                    onClick={ConnectWallet}
                    isLoading={isConnecting}
                    loadingText="Connecting..."
                    width="full"
                  >
                    Connect Freighter Wallet
                  </Button>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      value={adminCredentials.username}
                      onChange={(e) =>
                        setAdminCredentials({ ...adminCredentials, username: e.target.value })
                      }
                      placeholder="Enter Username"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={adminCredentials.password}
                      onChange={(e) =>
                        setAdminCredentials({ ...adminCredentials, password: e.target.value })
                      }
                      placeholder="Enter Password"
                    />
                  </FormControl>
                  <Button
                    colorScheme="green"
                    onClick={LoginAsAdmin}
                    isLoading={isLoggingIn}
                    loadingText="Logging In..."
                    width="full"
                  >
                    Login As Admin
                  </Button>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    Default Admin Credentials: admin / 12345678
                  </Text>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Login;