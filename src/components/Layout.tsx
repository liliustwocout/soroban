import {
  Box,
  Button,
  Collapse,
  Container,
  Flex,
  Icon,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  HamburgerIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Wallet } from "@/components/Wallet";
import { useAppContext } from "@/context/appContext";

const ButtonToggleTheme = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button
      variant="solid"
      size="md"
      bg="red.300"
      display={{ md: "inline-flex" }}
      fontSize="sm"
      color="white"
      onClick={toggleColorMode}
      _hover={{
        bg: "pink.300",
      }}
    >
      {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
};

export default function Layout() {
  const { isOpen, onToggle } = useDisclosure();
  const { userType, walletAddress, setWalletAddress, setHasVoted, setCandidates, setUserType, setAdminToken } = useAppContext();
  const navigate = useNavigate();

  const disconnectWallet = () => {
    setWalletAddress("");
    setHasVoted(false);
    setCandidates([]);
    setUserType(null);
    setAdminToken(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("wallet");
    try {
      navigate('/');
    } catch (e) { }
  };

  const getNavItems = () => {
    if (userType === "admin") {
      return [
        { label: "Dashboard", href: "/" },
        { label: "View Votes", href: "/Votes" },
        { label: "Register Candidate", href: "/Register-Candidate" },
      ];
    }
    return [
      { label: "Home", href: "/" },
      { label: "Vote", href: "/Vote" },
      { label: "Results", href: "/Results" },
    ];
  };

  return (
    <Box>
      <Flex
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex="banner"
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH="64px"
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottomWidth="1px"
        borderBottomStyle="solid"
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
        align="center"
      >
        <Container maxW="750">
          <Flex
            bg={useColorModeValue("white", "gray.800")}
            color={useColorModeValue("gray.600", "white")}
            minH="60px"
            py={{ base: 2 }}
            px={{ base: 0 }}
            align="center"
          >
            <Flex ml={{ base: -2 }} display={{ base: "flex", md: "none" }}>
              <IconButton
                onClick={onToggle}
                icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                variant="ghost"
                aria-label="Toggle Navigation"
              />
            </Flex>
            <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
              <Flex display={{ base: "none", md: "flex" }}>
                <DesktopNav navItems={getNavItems()} />
              </Flex>
            </Flex>
            <Flex align="center" direction="row" gap={4}>
              {walletAddress && (
                <Text fontSize="sm" color="gray.600">
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
                </Text>
              )}
              {userType && (
                <Button colorScheme="red" onClick={disconnectWallet}>
                  Logout
                </Button>
              )}
              {userType !== "admin" && !walletAddress && <Wallet />}
              <ButtonToggleTheme />
            </Flex>
          </Flex>
        </Container>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav onToggleNavbar={onToggle} navItems={getNavItems()} />
      </Collapse>
      <Container pt="80px" maxW="750" textTransform="capitalize">
        <Outlet />
      </Container>
    </Box>
  );
}

const DesktopNav = ({ navItems }: { navItems: Array<NavItem> }) => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction="row" spacing={4}>
      {navItems.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Link style={{ cursor: "pointer", width: "100%", height: "100%" }} to={navItem!.href!}>
                <Box
                  p={2}
                  fontSize="sm"
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: "none",
                    color: linkHoverColor,
                  }}
                >
                  {navItem.label}
                </Box>
              </Link>
            </PopoverTrigger>
            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow="xl"
                bg={popoverContentBgColor}
                p={4}
                rounded="xl"
                minW="sm"
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Box
      role="group"
      display="block"
      p={2}
      rounded="md"
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction="row" align="center">
        <Link style={{ cursor: "pointer", width: "100%", height: "100%" }} to={href!}>
          <Box>
            <Text
              transition="all .3s ease"
              _groupHover={{ color: "pink.400" }}
              fontWeight={500}
            >
              {label}
            </Text>
            <Text fontSize="sm">{subLabel}</Text>
          </Box>
        </Link>
        <Flex
          transition="all .3s ease"
          transform="translateX(-10px)"
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify="flex-end"
          align="center"
          flex={1}
        >
          <Icon color="pink.400" w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = ({ onToggleNavbar, navItems }: { onToggleNavbar: any, navItems: Array<NavItem> }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {navItems.map((navItem) => (
        <MobileNavItem
          onToggleNavbar={onToggleNavbar}
          key={navItem.label}
          {...navItem}
        />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({
  label,
  children,
  href,
  onToggleNavbar,
}: NavItem & { onToggleNavbar: any }) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Link
        onClick={onToggleNavbar}
        style={{ cursor: "pointer", width: "100%", height: "100%" }}
        to={href!}
      >
        <Box
          py={2}
          justifyContent="space-between"
          alignItems="center"
          _hover={{
            textDecoration: "none",
          }}
        >
          <Flex justify="space-between">
            <Text
              fontWeight={600}
              color={useColorModeValue("gray.600", "gray.200")}
            >
              {label}
            </Text>
            {children && (
              <Icon
                as={ChevronDownIcon}
                transition="all .25s ease-in-out"
                transform={isOpen ? "rotate(180deg)" : ""}
                w={6}
                h={6}
              />
            )}
          </Flex>
        </Box>
      </Link>
      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle="solid"
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align="start"
        >
          {children &&
            children.map((child) => (
              <Link
                style={{ cursor: "pointer", width: "100%", height: "100%" }}
                to={child!.href!}
              >
                <Box key={child.label} py={2}>
                  {child?.label}
                </Box>
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}