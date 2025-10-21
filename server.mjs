import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

const JWT_SECRET = '4fc4b259c4106cfa2037a42d58b45d89b9c8dcb82a4547f9f4c0038880783572';
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1412',
  database: 'stellarvote',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
let db;
async function initializeDatabase() {
  try {
    db = mysql.createPool(dbConfig);
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();

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

    const [adminCountRows] = await db.execute('SELECT COUNT(*) as count FROM admins');
    if (adminCountRows[0].count === 0) {
      const hashedPassword = await bcrypt.hash('12345678', 10);
      await db.execute(
        'INSERT INTO admins (username, password_hash) VALUES (?, ?)',
        ['admin', hashedPassword]
      );
    }

    const [candidateCountRows] = await db.execute('SELECT COUNT(*) as count FROM candidates');
    if (candidateCountRows[0].count === 0) {
      await db.execute(
        'INSERT INTO candidates (name, description) VALUES (?, ?)',
        ['Alice Johnson', 'Experienced Leader Focused On Community Development & Sustainable Growth.']
      );
      await db.execute(
        'INSERT INTO candidates (name, description) VALUES (?, ?)',
        ['Bob Smith', 'Technology Expert Committed To Innovation & Digital Transformation.']
      );
      await db.execute(
        'INSERT INTO candidates (name, description) VALUES (?, ?)',
        ['Carol Davis', 'Education Advocate Working To Improve Schools & Learning Opportunities.']
      );
    }
    console.log('Database Initialized Successfully!');
  } catch (error) {
    console.error('Database Initialization Failed:', error);
    throw error;
  }
}
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let token = null;
  if (authHeader) {
    const parts = authHeader.split(' ');
    token = parts.length > 1 ? parts[1] : parts[0];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Access Denied! No Token Provided!' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid Token!' });
  }
};
app.post('/api/auth/user-login', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet Address Required!' });
    }
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
    console.error('User Login Error:', error);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
});
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
    console.error('Get Candidates Error:', error);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
});
app.post('/api/vote', async (req, res) => {
  try {
    const { walletAddress, candidateId } = req.body;
    if (!walletAddress || candidateId === undefined || candidateId === null) {
      return res.status(400).json({ error: 'Wallet Address & Candidate ID Required!' });
    }

    const candidateIdNum = Number(candidateId);
    if (!Number.isInteger(candidateIdNum) || candidateIdNum <= 0) {
      return res.status(400).json({ error: 'Invalid Candidate ID!' });
    }

    const [user] = await db.execute(
      'SELECT * FROM users WHERE wallet_address = ?',
      [walletAddress]
    );
    if (user.length === 0) {
      return res.status(404).json({ error: 'User Not Found!' });
    }
    if (user[0].has_voted) {
      return res.status(400).json({ error: 'User Has Already Voted!' });
    }
    const [candidate] = await db.execute(
      'SELECT * FROM candidates WHERE id = ?',
      [candidateIdNum]
    );
    if (candidate.length === 0) {
      return res.status(404).json({ error: 'Candidate Not Found!' });
    }
    await db.execute(
      'UPDATE users SET has_voted = TRUE, vote_candidate_id = ? WHERE wallet_address = ?',
      [candidateIdNum, walletAddress]
    );
    res.json({ success: true, message: 'Vote Submitted Successfully!' });
  } catch (error) {
    console.error('Vote Submission Error:', error);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
});
app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username & Password Required!' });
    }
    const [admin] = await db.execute(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );
    if (admin.length === 0) {
      return res.status(401).json({ error: 'Invalid Credentials!' });
    }
    const isValidPassword = await bcrypt.compare(password, admin[0].password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid Credentials!' });
    }
    const token = jwt.sign(
      { id: admin[0].id, username: admin[0].username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      success: true,
      token,
      admin: { id: admin[0].id, username: admin[0].username }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
});
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
    console.error('Get Votes Error:', error);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
});
app.post('/api/admin/candidates', verifyAdminToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Candidate Name Is Required!' });
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
    console.error('Register Candidate Error:', error);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
});
app.get('/api/admin/dashboard', verifyAdminToken, async (req, res) => {
  try {
    const [totalUsers] = await db.execute('SELECT COUNT(*) as count FROM users');
    const [totalVotes] = await db.execute('SELECT COUNT(*) as count FROM users WHERE has_voted = TRUE');
    const [totalCandidates] = await db.execute('SELECT COUNT(*) as count FROM candidates');
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
    console.error('Get Dashboard Error:', error);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
});
initializeDatabase().then(() => {
  const server = app.listen(PORT, () => {
    console.log('Server Running On Port ' + PORT);
  });

  const shutdown = async () => {
    console.log('Shutting Down Server...');
    try {
      if (db) await db.end();
    } catch (e) {
      console.error('Error Closing DB Pool:', e);
    }
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}).catch(error => {
  console.error('Failed To Initialize Database:', error);
  process.exit(1);
});