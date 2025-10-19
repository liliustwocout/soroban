# TODO: Change App to Election using Stellar & Freighter

## Overview
Transform the current Soroban Bitcoin Price Oracle app into an Election app. This involves replacing existing contracts (BTC token, donation, oracle) with new election-related contracts (e.g., election contract for candidate registration, voting, and result tallying). Update the frontend to include election features like candidate management, voting interface, and results display, while retaining Stellar & Freighter wallet integration.

## Steps

### 1. Update Project Metadata
- [x] Change package.json name from "soroban-oracle-project" to "soroban-election-app"
- [x] Update README.md title and description to reflect Election app
- [x] Update scripts in package.json to build election contracts instead of oracle/btc/donation

### 2. Create New Contracts
- [x] Create a new Rust contract for Election in contracts/election/
  - [x] Implement functions: register_candidate, vote, get_candidates, get_results
  - [x] Use Soroban SDK for smart contract logic
- [x] Update Cargo.toml files for the new contract
- [x] Build and deploy the new contract (update initialize.sh accordingly)

### 3. Update Shared Contracts Configuration
- [x] Modify src/shared/contracts.ts to import and instantiate the new election contract instead of btc, donation, oracle
- [x] Remove references to old contracts

### 4. Update Frontend Context
- [x] Modify src/context/appContext.tsx to include election-related state (e.g., candidates, votes, user vote status)

### 5. Update Routes and Components
- [x] Update src/components/AppRoutes.tsx to replace routes with election pages:
  - [x] Home: CandidateList
  - [x] Vote: VoteForm
  - [x] Results: ElectionResults
  - [x] Register Candidate: RegisterCandidateForm
- [x] Create new components:
  - [x] CandidateList.tsx: Display list of candidates
  - [x] VoteForm.tsx: Allow users to vote for candidates
  - [x] ElectionResults.tsx: Show voting results
  - [x] RegisterCandidateForm.tsx: Form to register new candidates
- [x] Remove old components: PairsList, PairDetails, Mint, Donate, OracleForm

### 6. Update Wallet Integration
- [x] Ensure Wallet.tsx remains compatible (already uses Stellar & Freighter)
- [x] Update any contract interactions in components to use the new election contract

### 7. Update Forms and Utils
- [x] Modify src/components/Forms/ to include election forms (e.g., VoteForm, RegisterCandidate)
- [x] Update src/utils/ if needed for election logic

### 8. Testing and Deployment
- [x] Update initialize.sh to deploy election contract
- [x] Test wallet connection and contract interactions
- [x] Run npm run dev and verify election features work
- [x] Update CRON if needed (remove BTC price updates)

### 9. Final Cleanup
- [x] Remove unused files (e.g., old contract bindings, unused components)
- [x] Update any remaining references to oracle/BTC in code
