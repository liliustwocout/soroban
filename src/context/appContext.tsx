import React, { createContext, useContext, useState, useEffect } from "react";
interface Candidate {
  id: number;
  name: string;
  description: string;
  vote_count: number;
}
const AppContext = createContext<{
  walletAddress: string;
  setWalletAddress: (value: string) => void;
  candidates: Candidate[];
  setCandidates: (value: Candidate[]) => void;
  hasVoted: boolean;
  setHasVoted: (value: boolean) => void;
  userType: 'user' | 'admin' | null;
  setUserType: (value: 'user' | 'admin' | null) => void;
  adminToken: string | null;
  setAdminToken: (value: string | null) => void;
}>({
  walletAddress: "",
  setWalletAddress: () => { },
  candidates: [],
  setCandidates: () => { },
  hasVoted: false,
  setHasVoted: () => { },
  userType: null,
  setUserType: () => { },
  adminToken: null,
  setAdminToken: () => { },
});
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [userType, setUserType] = useState<'user' | 'admin' | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  useEffect(() => {
    const storedAdminToken = localStorage.getItem('adminToken');
    if (storedAdminToken) {
      setAdminToken(storedAdminToken);
      setUserType('admin');
    }
  }, []);
  return (
    <AppContext.Provider value={{
      walletAddress,
      setWalletAddress,
      candidates,
      setCandidates,
      hasVoted,
      setHasVoted,
      userType,
      setUserType,
      adminToken,
      setAdminToken
    }}>
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => useContext(AppContext);