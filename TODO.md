# TODO: Implement User/Admin Separation with MySQL Database

## Phase 1: Database Setup
- [ ] Install MySQL and create database schema
- [ ] Create `users` table: (id, wallet_address, has_voted BOOLEAN, vote_candidate_id INT, created_at)
- [ ] Create `candidates` table: (id, name, description, created_at)
- [ ] Create `admins` table: (id, username, password_hash)

## Phase 2: Backend API Development
- [ ] Set up Node.js/Express server with MySQL connection
- [ ] Create API endpoints:
  - POST /api/auth/user-login (verify wallet connection)
  - POST /api/vote (save vote to database)
  - GET /api/candidates (get all candidates)
  - POST /api/auth/admin-login (static admin: admin/admin123)
  - GET /api/admin/votes (admin view all votes)
  - POST /api/admin/candidates (admin register candidate)
  - GET /api/admin/dashboard (admin statistics)

## Phase 3: Frontend Authentication
- [ ] Create Login page with two options:
  - Connect Wallet (for users)
  - Admin Login (username/password)
- [ ] Update AppContext to handle user type (user/admin)
- [ ] Implement session management for admin login

## Phase 4: User Flow Updates
- [ ] Modify VoteForm to call API instead of smart contract
- [ ] Update CandidateList to fetch from API
- [ ] Remove direct smart contract calls for voting
- [ ] Add user dashboard showing voting status

## Phase 5: Admin Flow Implementation
- [ ] Create AdminLayout component
- [ ] Build AdminDashboard with vote statistics
- [ ] Create AdminCandidateRegistration form
- [ ] Build AdminVotesViewer component
- [ ] Implement admin navigation and routing

## Phase 6: Integration & Testing
- [ ] Update package.json with new dependencies (mysql2, express, cors, bcrypt)
- [ ] Test user wallet login flow
- [ ] Test admin login and functionality
- [ ] Test vote submission and storage
- [ ] Test candidate registration by admin
- [ ] Update README with new setup instructions

## Phase 7: Security & Deployment
- [ ] Implement input validation and sanitization
- [ ] Add rate limiting for API endpoints
- [ ] Secure admin credentials (hash passwords)
- [ ] Update deployment scripts for backend
- [ ] Test full user and admin flows
