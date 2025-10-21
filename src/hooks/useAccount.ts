import { useAppContext } from "@/context/appContext";
const addressObject = {
  address: "",
  displayName: "",
};
const addressToHistoricObject = (address: string) => {
  addressObject.address = address;
  addressObject.displayName = `${address.slice(0, 4)}...${address.slice(-4)}`;
  return addressObject;
};
export function useAccount(): typeof addressObject | null {
  const { walletAddress } = useAppContext();
  if (walletAddress) return addressToHistoricObject(walletAddress);
  return null;
}