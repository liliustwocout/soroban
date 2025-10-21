export const Contract = class {
  constructor(options: any) {
    this.rpcUrl = options.rpcUrl;
    this.contractId = options.contractId;
    this.candidates = [
      {
        id: 1,
        name: "Alice Johnson",
        description: "Experienced Leader Focused On Community Development & Sustainable Growth",
        vote_count: 15
      },
      {
        id: 2,
        name: "Bob Smith",
        description: "Technology Expert Committed To Innovation & Digital Transformation",
        vote_count: 12
      },
      {
        id: 3,
        name: "Carol Davis",
        description: "Education Advocate Working To Improve Schools & Learning Opportunities",
        vote_count: 8
      }
    ];
    this.votedWallets = new Set();
  }

  rpcUrl: string;
  contractId: string;
  candidates: any[];
  votedWallets: Set<string>;

  async initialize(options: { admin: string }) {
    return { success: true };
  }

  async register_candidate(options: { candidate: string }) {
    const candidateInfo = options.candidate.split(' - ');
    const name = candidateInfo[0];
    const description = candidateInfo[1] || 'No Description Provided!';

    const newCandidate = {
      id: this.candidates.length + 1,
      name: name,
      description: description,
      vote_count: 0
    };

    this.candidates.push(newCandidate);
    return { success: true };
  }

  async vote(options: { voter: string, candidate: string }) {
    const candidateId = parseInt(options.candidate);
    const voter = options.voter;

    if (this.votedWallets.has(voter)) {
      throw new Error('Wallet Has Already Voted!');
    }

    const candidate = this.candidates.find(c => c.id === candidateId);
    if (!candidate) {
      throw new Error('Candidate Not Found!');
    }

    candidate.vote_count += 1;
    this.votedWallets.add(voter);

    return { success: true };
  }

  async get_candidates() {
    return [...this.candidates];
  }

  async get_results() {
    return await this.get_candidates();
  }

  async has_voted(voter: string) {
    return this.votedWallets.has(voter);
  }

  async get_total_votes() {
    const candidates = await this.get_candidates();
    return candidates.reduce((sum: number, candidate: any) => sum + candidate.vote_count, 0);
  }
};

export const networks = {
  futurenet: {
    contractId: 'mockContractId',
    networkPassphrase: 'Test SDF Future Network ; October 2022',
  },
};