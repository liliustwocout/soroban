use soroban_sdk : :{contract,contractimpl,contracttype,Address,Env,Map,String,Vec};

pub struct Candidate{
  pub id : u32,
  pub name : String,
  pub description : String,
  pub voteCount : u32,
}

pub struct ElectionContract;

impl ElectionContract{
  pub fn initialize(env : Env,admin : Address){
    admin.require_auth();
    env.storage().instance().set(& "admin",& admin);
    env.storage().instance().set(& "nextCandidateId",& 1u32);
    env.storage().instance().set(& "totalVotes",& 0u32);
  }

  pub fn registerCandidate(env : Env,name : String,description : String)- > u32{
    let mut nextId : u32 = env
    .storage()
    .instance()
    .get(& "nextCandidateId")
    .unwrap_or(1);
    let candidate = Candidate{
      id : nextId,
      name : name.clone(),
      description,
      voteCount : 0,
    };
    let mut candidates : Map < u32,Candidate > = env
    .storage()
    .instance()
    .get(& "candidates")
    .unwrap_or(Map : : new(& env));
    candidates.set(nextId,candidate);
    env.storage().instance().set(& "candidates",& candidates);
    nextId + = 1;
    env.storage().instance().set(& "nextCandidateId",& nextId);
    nextId - 1
  }

  pub fn vote(env : Env,voter : Address,candidateId : u32){
    voter.require_auth();
    let hasVoted : bool = env.storage().persistent().get(& voter).unwrap_or(false);
    if hasVoted{
      panic !("Voter Has Already Voted ! ");
    }
    let mut candidates : Map < u32,Candidate > = env
    .storage()
    .instance()
    .get(& "candidates")
    .unwrap_or(Map : : new(& env));
    let mut candidate = candidates.get(candidateId).unwrap();
    candidate.voteCount + = 1;
    candidates.set(candidateId,candidate);
    env.storage().instance().set(& "candidates",& candidates);
    env.storage().persistent().set(& voter,& true);
    let mut totalVotes : u32 = env.storage().instance().get(& "totalVotes").unwrap_or(0);
    totalVotes + = 1;
    env.storage().instance().set(& "totalVotes",& totalVotes);
  }

  pub fn getCandidates(env : Env)- > Vec < Candidate >{
    let candidates : Map < u32,Candidate > = env
    .storage()
    .instance()
    .get(& "candidates")
    .unwrap_or(Map : : new(& env));
    let mut result = Vec : : new(& env);
    for(_,candidate)in candidates.iter(){
      result.push_back(candidate);
    }
    result
  }

  pub fn getResults(env : Env)- > Vec < Candidate >{
    Self : : getCandidates(env)
  }

  pub fn hasVoted(env : Env,voter : Address)- > bool{
    env.storage().persistent().get(& voter).unwrap_or(false)
  }

  pub fn getTotalVotes(env : Env)- > u32{
    env.storage().instance().get(& "totalVotes").unwrap_or(0)
  }
}

mod test{
  use super : : *;
  use soroban_sdk : : testutils : :{Address as _,Ledger};

  fn testRegisterCandidate(){
    let env = Env : : default();
    let contractId = env.register_contract(None,ElectionContract);
    let client = ElectionContractClient : : new(& env,& contractId);
    let admin = Address : : random(& env);
    client.initialize(& admin);
    let candidateId = client.registerCandidate(& "Alice".into(),& "Vote For Alice".into());
    assert_eq !(candidateId,1);
  }

  fn testVote(){
    let env = Env : : default();
    let contractId = env.register_contract(None,ElectionContract);
    let client = ElectionContractClient : : new(& env,& contractId);
    let admin = Address : : random(& env);
    client.initialize(& admin);
    let candidateId = client.registerCandidate(& "Bob".into(),& "Vote For Bob".into());
    let voter = Address : : random(& env);
    client.vote(& voter,& candidateId);
    assert !(client.hasVoted(& voter));
    assert_eq !(client.getTotalVotes(),1);
  }
}