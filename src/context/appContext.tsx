import React, { createContext, useContext, useState } from "react";

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
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasVoted, setHasVoted] = useState(false);

  return (
    <AppContext.Provider value={{
      walletAddress,
      setWalletAddress,
      candidates,
      setCandidates,
      hasVoted,
      setHasVoted
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
