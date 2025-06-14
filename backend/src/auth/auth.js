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