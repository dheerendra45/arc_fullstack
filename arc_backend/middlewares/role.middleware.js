// middlewares/role.middleware.js
const adminMiddleware = (req, res, next) => {
  console.log("admin")
  // Check if user exists (from auth middleware) and is admin
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required' });
  }
  
  // Continue to next middleware
  next();
};

export default adminMiddleware;