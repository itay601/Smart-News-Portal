// auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const { pool } = require('../../src/index'); // assume you've exported a configured pg Pool instance
const express = require('express');





// Generate a JWT token for a given user payload
const generateToken = (user) => {
  const payload = {
    username: user.username,
    password: user.password,
    email: user.email,
    role: user.role
  };
  const options = {
    expiresIn: '1h' // token valid for 1 hour
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// Extract and verify user from token
const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
    req.user = user;
    next();
  });
};

function RegisterRouter(pool) {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      

      // Check if user exists
      const [userExist] = await pool.query(
        'SELECT username, email, role FROM user WHERE username = ? OR email = ?',
        [username, email]
      );
      
      console.log('User existence query result:', userExist);

      // MySQL2 returns rows directly in userExist
      if (userExist.length > 0) {
        console.log('Existing user(s) found:', userExist);
        return res.status(409).json({ message: 'User already exists' });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log('Hashed password:', hashedPassword);

      // Insert new user
      const [result] = await pool.query(
        'INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      console.log('Insert result:', result);

      // Fetch the newly created user
      const [rows] = await pool.query(
        'SELECT username, email, role FROM user WHERE username = ?',
        [username]
      );
      console.log('Fetched new user:', rows);

      const newUser = rows[0];
      if (!newUser) {
        console.error('Failed to fetch newly created user');
        return res.status(500).json({ message: 'Failed to retrieve new user' });
      }

      // Generate token (assuming generateToken is defined)
      const token = generateToken(newUser);
      console.log('Generated token:', token);

      // Send response
      res.status(201).json({ user: newUser, token });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
  });

  return router;
}




function authenticationRouter (pool) {

  const router = express.Router();
  // Login existing user
  // Expects: { username, password }
  router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query(
      'SELECT username, email, password, role FROM user WHERE username = ?',
      [username]
    );
    let user;
    if (Array.isArray(result)) {
      user = result[0];
    } else if (result && result.rows) {
      
      user = result.rows[0];
    } else if (result && Array.isArray(result.results)) {
      user = result.results[0];
    } else {
      // If result itself is the user object
      user = result;
    }
    // Additional check: if user is still an array, get the first element
    if (Array.isArray(user)) {
      user = user[0];
    }
    
    if (!user) {
      return res.status(400).json({ message: 'No user found' });
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // generate token
    const token = generateToken(user);
    // remove password from response
    delete user.password;
    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});
return router;
}

module.exports = {
  generateToken,
  getUserFromToken,
  authenticateToken,
  authenticationRouter,
  RegisterRouter
};
