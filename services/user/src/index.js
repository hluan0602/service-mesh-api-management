const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Database connection
const pool = new Pool({
        connectionString: process.env.DATABASE_URL
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
async function initDb() {
        try {
                await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
                console.log('Database initialized');
        } catch (err) {
                console.error('Error initializing database:', err);
        }
}

initDb();

// Routes
// Register
app.post('/api/auth/register', async (req, res) => {
        try {
                const { username, email, password } = req.body;

                // Check if user exists
                const userCheck = await pool.query(
                        'SELECT * FROM users WHERE email = $1 OR username = $2',
                        [email, username]
                );

                if (userCheck.rows.length > 0) {
                        return res.status(400).json({ message: 'User already exists' });
                }

                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Create user
                const result = await pool.query(
                        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
                        [username, email, hashedPassword]
                );

                res.status(201).json(result.rows[0]);
        } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Server error' });
        }
});

// Login
app.post('/api/auth/login', async (req, res) => {
        try {
                const { email, password } = req.body;

                // Check if user exists
                const result = await pool.query(
                        'SELECT * FROM users WHERE email = $1',
                        [email]
                );

                if (result.rows.length === 0) {
                        return res.status(400).json({ message: 'Invalid credentials' });
                }

                const user = result.rows[0];

                // Check password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                        return res.status(400).json({ message: 'Invalid credentials' });
                }

                // Generate JWT
                const payload = {
                        user: {
                                id: user.id,
                                username: user.username
                        }
                };

                jwt.sign(
                        payload,
                        JWT_SECRET,
                        { expiresIn: '1h' },
                        (err, token) => {
                                if (err) throw err;
                                res.json({ token });
                        }
                );
        } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Server error' });
        }
});

// Get user profile
app.get('/api/users/me', async (req, res) => {
        try {
                const token = req.header('Authorization').replace('Bearer ', '');
                const decoded = jwt.verify(token, JWT_SECRET);

                const result = await pool.query(
                        'SELECT id, username, email, created_at FROM users WHERE id = $1',
                        [decoded.user.id]
                );

                if (result.rows.length === 0) {
                        return res.status(404).json({ message: 'User not found' });
                }

                res.json(result.rows[0]);
        } catch (err) {
                console.error(err);
                res.status(401).json({ message: 'Please authenticate' });
        }
});

// Health check
app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
        console.log(`User service running on port ${PORT}`);
});