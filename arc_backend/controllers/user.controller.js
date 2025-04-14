import User from '../models/user.model.js';

// GET /admin/users
export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;
    
    // Base query - filter out deleted users
    let query = { isDeleted: false };
    
    // Add role filter if provided
    if (role) {
      query.role = role;
    }
    
    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));
    
    res.json({
      users,
      meta: {
        total: totalUsers,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /admin/user/:id (soft delete)
export const softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ message: 'User soft deleted successfully', user });
  } catch (error) {
    console.error('Error in softDeleteUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};