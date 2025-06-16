//auth.js
const jwt = require('jsonwebtoken');

const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

module.exports = { getUserFromToken };

//in PRODUCTION!!!
//const getUserFromToken = async (token) => {
//  if (!token) return null;
  
//  try {
//    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
//    const result = await pool.query(
//      'SELECT username, email, role FROM users WHERE username = $1',
//      [decoded.username]
//    );
//    
//    return result.rows[0] || null;
//  } catch (error) {
//    return null;
//  }
//};