// Helper function to verify admin role
const requireAdmin = (user) => {
  if (!user.username) {
    throw new Error('Authentication required');
  }
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
};

module.exports = requireAdmin;