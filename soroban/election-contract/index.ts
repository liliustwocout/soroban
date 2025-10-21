// Mock election contract bindings for testing
export const Contract = class {
    constructor(options: any) {
        this.rpcUrl = options.rpcUrl;
        this.contractId = options.contractId;
        // Initialize with some default candidates
        this.candidates = [
            {
                id: 1,
                name: "Alice Johnson",
                description: "Experienced leader focused on community development and sustainable growth.",
                vote_count: 15
            },
            {
                id: 2,
                name: "Bob Smith",
                description: "Technology expert committed to innovation and digital transformation.",
                vote_count: 12
            },
            {
                id: 3,
                name: "Carol Davis",
                description: "Education advocate working to improve schools and learning opportunities.",
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
        // Mock implementation
        console.log('Initializing election contract with admin:', options.admin);
        return { success: true };
    }

    async register_candidate(options: { candidate: string }) {
        // Mock implementation - add candidate to the list
        const candidateInfo = options.candidate.split(' - ');
        const name = candidateInfo[0];
        const description = candidateInfo[1] || 'No description provided';

        const newCandidate = {
            id: this.candidates.length + 1,
            name: name,
            description: description,
            vote_count: 0
        };

        this.candidates.push(newCandidate);
        console.log('Registered new candidate:', newCandidate);
        return { success: true };
    }

    async vote(options: { voter: string, candidate: string }) {
        // Mock implementation - record vote and increment count
        const candidateId = parseInt(options.candidate);
        const voter = options.voter;

        if (this.votedWallets.has(voter)) {
            throw new Error('Wallet has already voted');
        }

        const candidate = this.candidates.find(c => c.id === candidateId);
        if (!candidate) {
            throw new Error('Candidate not found');
        }

        candidate.vote_count += 1;
        this.votedWallets.add(voter);

        console.log('Vote recorded for candidate:', candidateId, 'by voter:', voter);
        return { success: true };
    }

    async get_candidates() {
        // Return current candidates list (including newly registered ones)
        return [...this.candidates];
    }

    async get_results() {
        // Mock implementation - return same as get_candidates for results
        return await this.get_candidates();
    }

    async has_voted(voter: string) {
        // Check if wallet has voted
        return this.votedWallets.has(voter);
    }

    async get_total_votes() {
        // Mock implementation
        const candidates = await this.get_candidates();
        return candidates.reduce((sum: number, candidate: any) => sum + candidate.vote_count, 0);
    }
};

export const networks = {
    futurenet: {
        contractId: 'mock-contract-id',
        networkPassphrase: 'Test SDF Future Network ; October 2022',
    },
};
