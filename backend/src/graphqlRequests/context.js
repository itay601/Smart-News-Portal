// graphql/context.js
const { getUserFromToken } = require('../auth/auth');

const buildContext = ({ req }, cache, pool) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];
  const user = getUserFromToken(token);
  //console.log("User from token:", user);
  return { user, cache, pool };
};

module.exports = buildContext;