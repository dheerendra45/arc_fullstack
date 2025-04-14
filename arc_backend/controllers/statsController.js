import { getDashboardStats } from '../utils/statsService.js';


export const getStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(new ErrorResponse('Failed to fetch statistics', 500));
  }
};
