import { Button, useToast } from "@chakra-ui/react";
import { IconWallet, IconLogout, IconLoader } from "@tabler/icons-react";
import CopyButton from "@/components/CopyButton";
import { formatShortAddress } from "@/utils/utils";
import {
  StellarWalletsKit,
  WalletNetwork,
  ISupportedWallet,
} from "stellar-wallets-kit";
import { FREIGHTER_ID } from "stellar-wallets-kit/modules/freighter.module";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/appContext";
import { useNavigate } from "react-router-dom";

const FUTURENET_DETAILS = {
  network: "FUTURENET",
  networkUrl: "https://horizon-futurenet.stellar.org",
  networkPassphrase: "Test SDF Future Network ; October 2022",
};

const ERRORS = {
  WALLET_CONNECTION_REJECTED: "Wallet Connection Rejected",
};

const STORAGE_WALLET_KEY = "wallet";
const AllowedWallets = [
  FREIGHTER_ID,
];

export const Wallet = () => {
  const toast = useToast();
  const { walletAddress, setWalletAddress } = useAppContext();
  const navigate = useNavigate();
  const [SelectedNetwork] = useState(FUTURENET_DETAILS);
  const [SWKKit] = useState(() => {
    const { FreighterModule } = require("stellar-wallets-kit/modules/freighter.module");
    return new StellarWalletsKit({
      network: SelectedNetwork.networkPassphrase as WalletNetwork,
      modules: [new FreighterModule()],
    });
  });
  const [isLoading, setIsLoading] = useState(false);

  const GetWalletAddress = async (productId: string) => {
    try {
      setIsLoading(true);
      SWKKit.setWallet(productId);
      const { address: PublicKey } = await SWKKit.getAddress();
      setTimeout(() => {
        setWalletAddress(PublicKey);
        localStorage.setItem(STORAGE_WALLET_KEY, productId);
        setIsLoading(false);
      }, 500);
    } catch (Error) {
      localStorage.removeItem(STORAGE_WALLET_KEY);
      setIsLoading(false);
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
    const StoredWallet = localStorage.getItem(STORAGE_WALLET_KEY);
    if (StoredWallet && AllowedWallets.includes(StoredWallet)) {
      (async () => {
        await GetWalletAddress(StoredWallet);
      })();
    }
  }, []);

  const onClick = async () => {
    if (!walletAddress) {
      await SWKKit.openModal({
        onWalletSelected: async (Option: ISupportedWallet) => {
          await GetWalletAddress(Option.id);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <Button
        fontSize="sm"
        fontWeight={600}
        color="white"
        bg="gray.700"
        rightIcon={<IconLoader />}
      >
        Loading
      </Button>
    );
  }

  if (walletAddress) {
    const onDisconnect = () => {
      setWalletAddress("");
      localStorage.removeItem(STORAGE_WALLET_KEY);
      try {
        navigate('/');
      } catch (e) {
        // noop
      }
    };
    return (
      <>
        <CopyButton
          str={String(formatShortAddress(walletAddress))}
          value={walletAddress}
          size="xs"
        />
        <Button
          fontSize="sm"
          fontWeight={600}
          color="white"
          bg="gray.400"
          rightIcon={<IconLogout />}
          onClick={onDisconnect}
          _hover={{ bg: "gray.300" }}
        >
          Disconnect
        </Button>
      </>
    );
  }

  return (
    <Button
      fontSize="sm"
      fontWeight={600}
      color="white"
      bg="pink.400"
      rightIcon={<IconWallet />}
      onClick={onClick}
      _hover={{ bg: "pink.300" }}
    >
      Connect
    </Button>
  );
};

export default Wallet;