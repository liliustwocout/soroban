import { Box, Button, Card, CardBody, CardHeader, Heading, Input, VStack, Text, useToast, Tabs, TabList, TabPanels, Tab, TabPanel, FormControl, FormLabel } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/appContext";
import { StellarWalletsKit, WalletNetwork, WalletType, ISupportedWallet } from "stellar-wallets-kit";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { setUserType, setWalletAddress, setHasVoted, setAdminToken } = useAppContext();
    const [isConnecting, setIsConnecting] = useState(false);
    const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    // Soroban is only supported on Futurenet right now
    const FUTURENET_DETAILS = {
        network: "FUTURENET",
        networkUrl: "https://horizon-futurenet.stellar.org",
        networkPassphrase: "Test SDF Future Network ; October 2022",
    };

    const ERRORS = {
        WALLET_CONNECTION_REJECTED: "Wallet connection rejected",
    };

    const STORAGE_WALLET_KEY = "wallet";

    const allowedWallets = [
        WalletType.FREIGHTER,
        // WalletType.ALBEDO,
        // WalletType.XBULL,
    ];

    const [selectedNetwork] = useState(FUTURENET_DETAILS);
    // Setup swc, user will set the desired wallet on connect
    const [SWKKit] = useState(
        new StellarWalletsKit({
            network: selectedNetwork.networkPassphrase as WalletNetwork,
            selectedWallet: WalletType.FREIGHTER,
        })
    );

    // Whenever the selected network changes, set the network on swc
    useEffect(() => {
        SWKKit.setNetwork(selectedNetwork.networkPassphrase as WalletNetwork);
    }, [selectedNetwork.networkPassphrase, SWKKit]);

    const getWalletAddress = async (type: WalletType) => {
        try {
            setIsConnecting(true);
            // Set selected wallet, network, and public key
            SWKKit.setWallet(type);
            const publicKey = await SWKKit.getPublicKey();
            SWKKit.setNetwork(WalletNetwork.FUTURENET);

            // Short timeout to prevent blick on loading address
            setTimeout(async () => {
                // Login user via API
                const response = await fetch('http://localhost:5000/api/auth/user-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ walletAddress: publicKey }),
                });

                const data = await response.json();

                if (data.success) {
                    setWalletAddress(publicKey);
                    setHasVoted(data.user.hasVoted);
                    setUserType('user');
                    localStorage.setItem(STORAGE_WALLET_KEY, type);
                    toast({
                        title: "Wallet connected successfully!",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: "Login failed",
                        description: data.error || "Failed to authenticate user",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
                setIsConnecting(false);
            }, 500);
        } catch (error) {
            localStorage.removeItem(STORAGE_WALLET_KEY);
            setIsConnecting(false);
            toast({
                title: ERRORS.WALLET_CONNECTION_REJECTED,
                description: "",
                position: "bottom-right",
                status: "error",
                duration: 3000,
                isClosable: true,
                variant: "subtle",
            });
        }
    };

    useEffect(() => {
        const storedWallet = localStorage.getItem(STORAGE_WALLET_KEY);
        if (
            storedWallet &&
            Object.values(WalletType).includes(storedWallet as WalletType)
        ) {
            (async () => {
                await getWalletAddress(storedWallet as WalletType);
            })();
        }
    }, []);

    const connectWallet = async () => {
        if (!isConnecting) {
            // See https://github.com/Creit-Tech/Stellar-Wallets-Kit/tree/main for more options
            await SWKKit.openModal({
                allowedWallets,
                onWalletSelected: async (option: ISupportedWallet) => {
                    await getWalletAddress(option.type);
                },
            });
        }
    };

    const loginAsAdmin = async () => {
        if (!adminCredentials.username || !adminCredentials.password) {
            toast({
                title: "Missing credentials",
                description: "Please enter both username and password",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoggingIn(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/admin-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminCredentials),
            });

            const data = await response.json();

            if (data.success) {
                setAdminToken(data.token);
                localStorage.setItem('adminToken', data.token);
                setUserType('admin');
                toast({
                    title: "Admin login successful!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Login failed",
                    description: data.error || "Invalid credentials",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error("Admin login error:", error);
            toast({
                title: "Login error",
                description: "Failed to login as admin",
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
                    <Heading size="lg" textAlign="center">StellarVote Login</Heading>
                    <Text textAlign="center" color="gray.600" mt={2}>
                        Choose your login method
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
                                        Connect your Stellar wallet to participate in the election
                                    </Text>
                                    <Button
                                        colorScheme="blue"
                                        onClick={connectWallet}
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
                                            onChange={(e) => setAdminCredentials({
                                                ...adminCredentials,
                                                username: e.target.value
                                            })}
                                            placeholder="Enter username"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Password</FormLabel>
                                        <Input
                                            type="password"
                                            value={adminCredentials.password}
                                            onChange={(e) => setAdminCredentials({
                                                ...adminCredentials,
                                                password: e.target.value
                                            })}
                                            placeholder="Enter password"
                                        />
                                    </FormControl>
                                    <Button
                                        colorScheme="green"
                                        onClick={loginAsAdmin}
                                        isLoading={isLoggingIn}
                                        loadingText="Logging in..."
                                        width="full"
                                    >
                                        Login as Admin
                                    </Button>
                                    <Text fontSize="sm" color="gray.500" textAlign="center">
                                        Default admin credentials: admin / admin123
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
