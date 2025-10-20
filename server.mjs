import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'datpltn123',
    database: process.env.DB_NAME || 'stellarvote',
};

// Create database connection pool
let db;
async function initializeDatabase() {
    try {
        db = await mysql.createPool(dbConfig);

        // Create tables if they don't exist
        await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        wallet_address VARCHAR(255) UNIQUE NOT NULL,
        has_voted BOOLEAN DEFAULT FALSE,
        vote_candidate_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await db.execute(`
      CREATE TABLE IF NOT EXISTS candidates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        await db.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Insert default admin if not exists
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await db.execute(
            'INSERT IGNORE INTO admins (username, password_hash) VALUES (?, ?)',
            ['admin', hashedPassword]
        );

        // Insert default candidates if none exist
        const [candidates] = await db.execute('SELECT COUNT(*) as count FROM candidates');
        if (candidates[0].count === 0) {
            await db.execute(
                'INSERT INTO candidates (name, description) VALUES (?, ?)',
                ['Alice Johnson', 'Experienced leader focused on community development and sustainable growth.']
            );
            await db.execute(
                'INSERT INTO candidates (name, description) VALUES (?, ?)',
                ['Bob Smith', 'Technology expert committed to innovation and digital transformation.']
            );
            await db.execute(
                'INSERT INTO candidates (name, description) VALUES (?, ?)',
                ['Carol Davis', 'Education advocate working to improve schools and learning opportunities.']
            );
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

// Middleware to verify JWT token for admin routes
const verifyAdminToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

// API Routes

// User login with wallet
app.post('/api/auth/user-login', async (req, res) => {
    try {
        const { walletAddress } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address is required' });
        }

        // Check if user exists, if not create them
        const [existingUser] = await db.execute(
            'SELECT * FROM users WHERE wallet_address = ?',
            [walletAddress]
        );

        let user;
        if (existingUser.length === 0) {
            const [result] = await db.execute(
                'INSERT INTO users (wallet_address) VALUES (?)',
                [walletAddress]
            );
            user = { id: result.insertId, wallet_address: walletAddress, has_voted: false, vote_candidate_id: null };
        } else {
            user = existingUser[0];
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                walletAddress: user.wallet_address,
                hasVoted: user.has_voted,
                voteCandidateId: user.vote_candidate_id
            }
        });
    } catch (error) {
        console.error('User login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get candidates
app.get('/api/candidates', async (req, res) => {
    try {
        const [candidates] = await db.execute(`
            SELECT c.id, c.name, c.description, c.created_at, CAST(COUNT(u.id) AS UNSIGNED) as vote_count
            FROM candidates c
            LEFT JOIN users u ON c.id = u.vote_candidate_id AND u.has_voted = TRUE
            GROUP BY c.id, c.name, c.description, c.created_at
            ORDER BY c.id
        `);
        res.json({ candidates });
    } catch (error) {
        console.error('Get candidates error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Submit vote
app.post('/api/vote', async (req, res) => {
    try {
        const { walletAddress, candidateId } = req.body;

        if (!walletAddress || !candidateId) {
            return res.status(400).json({ error: 'Wallet address and candidate ID are required' });
        }

        // Check if user has already voted
        const [user] = await db.execute(
            'SELECT * FROM users WHERE wallet_address = ?',
            [walletAddress]
        );

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user[0].has_voted) {
            return res.status(400).json({ error: 'User has already voted' });
        }

        // Check if candidate exists
        const [candidate] = await db.execute(
            'SELECT * FROM candidates WHERE id = ?',
            [candidateId]
        );

        if (candidate.length === 0) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        // Record the vote
        await db.execute(
            'UPDATE users SET has_voted = TRUE, vote_candidate_id = ? WHERE wallet_address = ?',
            [candidateId, walletAddress]
        );

        res.json({ success: true, message: 'Vote submitted successfully' });
    } catch (error) {
        console.error('Vote submission error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin login
app.post('/api/auth/admin-login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const [admin] = await db.execute(
            'SELECT * FROM admins WHERE username = ?',
            [username]
        );

        if (admin.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, admin[0].password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin[0].id, username: admin[0].username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            admin: { id: admin[0].id, username: admin[0].username }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all votes (admin only)
app.get('/api/admin/votes', verifyAdminToken, async (req, res) => {
    try {
        const [votes] = await db.execute(`
      SELECT u.wallet_address, u.has_voted, u.vote_candidate_id, c.name as candidate_name, u.created_at
      FROM users u
      LEFT JOIN candidates c ON u.vote_candidate_id = c.id
      WHERE u.has_voted = TRUE
      ORDER BY u.created_at DESC
    `);

        res.json({ votes });
    } catch (error) {
        console.error('Get votes error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Register candidate (admin only)
app.post('/api/admin/candidates', verifyAdminToken, async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Candidate name is required' });
        }

        const [result] = await db.execute(
            'INSERT INTO candidates (name, description) VALUES (?, ?)',
            [name, description || '']
        );

        res.json({
            success: true,
            candidate: {
                id: result.insertId,
                name,
                description: description || ''
            }
        });
    } catch (error) {
        console.error('Register candidate error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get admin dashboard stats
app.get('/api/admin/dashboard', verifyAdminToken, async (req, res) => {
    try {
        const [totalUsers] = await db.execute('SELECT COUNT(*) as count FROM users');
        const [totalVotes] = await db.execute('SELECT COUNT(*) as count FROM users WHERE has_voted = TRUE');
        const [totalCandidates] = await db.execute('SELECT COUNT(*) as count FROM candidates');

        // Get vote distribution
        const [voteDistribution] = await db.execute(`
      SELECT c.name, COUNT(u.id) as vote_count
      FROM candidates c
      LEFT JOIN users u ON c.id = u.vote_candidate_id AND u.has_voted = TRUE
      GROUP BY c.id, c.name
      ORDER BY vote_count DESC
    `);

        res.json({
            stats: {
                totalUsers: totalUsers[0].count,
                totalVotes: totalVotes[0].count,
                totalCandidates: totalCandidates[0].count,
                voteDistribution
            }
        });
    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Initialize database and start server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Failed to initialize database:', error);
});
