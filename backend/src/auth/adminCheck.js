// Helper function to verify admin role
const requireAdmin = (user) => {
  if (!user) {
    throw new Error('Authentication required');
  }
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
};

module.exports = requireAdmin;