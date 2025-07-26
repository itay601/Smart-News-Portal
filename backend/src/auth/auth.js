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

// Expects: { username, email, password }
// Route: Register a new user
function RegisterRouter (pool) {

const router = express.Router();
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    console.log({ username, email, password });

    const userExist = await pool.query(
      'SELECT username, email, password, role FROM user WHERE username = ? AND email = ?',
      [username,email]
    );
    if (userExist.length > 0){
       return res.status(201).json( {message: "USER EXIST ALREADY"} );
    }
    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    res.status(201).json({ message: 'User registered' });
    // store in DB
    const [result] = await pool.query(
      'INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    const insertedUsername = username;

    // Then fetch the user
    const [rows] = await pool.query(
      'SELECT username, email, role FROM user WHERE username = ?',
      [insertedUsername]
    );

    const newUser = result.rows[0];
    const token = generateToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
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
