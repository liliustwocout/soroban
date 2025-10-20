import React, { createContext, useContext, useState, useEffect } from "react";

interface Candidate {
  id: number;
  name: string;
  description: string;
  vote_count: number;
}

const AppContext = createContext({
  walletAddress: "",
  setWalletAddress: (value: any) => value,
  candidates: [] as Candidate[],
  setCandidates: (value: Candidate[]) => value,
  hasVoted: false,
  setHasVoted: (value: boolean) => value,
  userType: null as 'user' | 'admin' | null,
  setUserType: (value: 'user' | 'admin' | null) => value,
  adminToken: null as string | null,
  setAdminToken: (value: string | null) => value,
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
