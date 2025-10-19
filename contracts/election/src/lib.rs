#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Map, String, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Candidate {
    pub id: u32,
    pub name: String,
    pub description: String,
    pub vote_count: u32,
}

#[contract]
pub struct ElectionContract;

#[contractimpl]
impl ElectionContract {
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&"admin", &admin);
        env.storage().instance().set(&"next_candidate_id", &1u32);
        env.storage().instance().set(&"total_votes", &0u32);
    }

    pub fn register_candidate(env: Env, name: String, description: String) -> u32 {
        let mut next_id: u32 = env
            .storage()
            .instance()
            .get(&"next_candidate_id")
            .unwrap_or(1);
        let candidate = Candidate {
            id: next_id,
            name: name.clone(),
            description,
            vote_count: 0,
        };

        let mut candidates: Map<u32, Candidate> = env
            .storage()
            .instance()
            .get(&"candidates")
            .unwrap_or(Map::new(&env));
        candidates.set(next_id, candidate);
        env.storage().instance().set(&"candidates", &candidates);

        next_id += 1;
        env.storage().instance().set(&"next_candidate_id", &next_id);

        next_id - 1
    }

    pub fn vote(env: Env, voter: Address, candidate_id: u32) {
        voter.require_auth();

        // Check if voter has already voted
        let has_voted: bool = env.storage().persistent().get(&voter).unwrap_or(false);
        if has_voted {
            panic!("Voter has already voted");
        }

        // Get candidates
        let mut candidates: Map<u32, Candidate> = env
            .storage()
            .instance()
            .get(&"candidates")
            .unwrap_or(Map::new(&env));
        let mut candidate = candidates.get(candidate_id).unwrap();

        // Increment vote count
        candidate.vote_count += 1;
        candidates.set(candidate_id, candidate);
        env.storage().instance().set(&"candidates", &candidates);

        // Mark voter as voted
        env.storage().persistent().set(&voter, &true);

        // Increment total votes
        let mut total_votes: u32 = env.storage().instance().get(&"total_votes").unwrap_or(0);
        total_votes += 1;
        env.storage().instance().set(&"total_votes", &total_votes);
    }

    pub fn get_candidates(env: Env) -> Vec<Candidate> {
        let candidates: Map<u32, Candidate> = env
            .storage()
            .instance()
            .get(&"candidates")
            .unwrap_or(Map::new(&env));
        let mut result = Vec::new(&env);
        for (_, candidate) in candidates.iter() {
            result.push_back(candidate);
        }
        result
    }

    pub fn get_results(env: Env) -> Vec<Candidate> {
        Self::get_candidates(env)
    }

    pub fn has_voted(env: Env, voter: Address) -> bool {
        env.storage().persistent().get(&voter).unwrap_or(false)
    }

    pub fn get_total_votes(env: Env) -> u32 {
        env.storage().instance().get(&"total_votes").unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _, Ledger};

    #[test]
    fn test_register_candidate() {
        let env = Env::default();
        let contract_id = env.register_contract(None, ElectionContract);
        let client = ElectionContractClient::new(&env, &contract_id);

        let admin = Address::random(&env);
        client.initialize(&admin);

        let candidate_id = client.register_candidate(&"Alice".into(), &"Vote for Alice".into());
        assert_eq!(candidate_id, 1);
    }

    #[test]
    fn test_vote() {
        let env = Env::default();
        let contract_id = env.register_contract(None, ElectionContract);
        let client = ElectionContractClient::new(&env, &contract_id);

        let admin = Address::random(&env);
        client.initialize(&admin);

        let candidate_id = client.register_candidate(&"Bob".into(), &"Vote for Bob".into());
        let voter = Address::random(&env);

        client.vote(&voter, &candidate_id);

        assert!(client.has_voted(&voter));
        assert_eq!(client.get_total_votes(), 1);
    }
}
