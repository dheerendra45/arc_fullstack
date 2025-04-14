import User from '../models/user.model.js';
import Opportunity from '../models/opportunity.model.js';
import moment from 'moment';

const getDashboardStats = async () => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ status: 'active' });
  const deletedUsers = await User.countDocuments({ status: 'deleted' });
  const totalOpportunities = await Opportunity.countDocuments();

  const chartData = await getChartData();

  return {
    totalUsers: totalUsers,
    activeUsers: activeUsers,
    deletedUsers: deletedUsers,
    totalOpportunities: totalOpportunities,
    chartData: chartData // This should be an array of objects with name, users, and opportunities properties
  };
};

const getChartData = async () => {
  const months = [];
  const now = moment();

  for (let i = 4; i >= 0; i--) {
    months.push(now.clone().subtract(i, 'months').format('MMM'));
  }

  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: moment().subtract(5, 'months').startOf('month').toDate(),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
  ]);

  const opportunityGrowth = await Opportunity.aggregate([
    {
      $match: {
        createdAt: {
          $gte: moment().subtract(5, 'months').startOf('month').toDate(),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
  ]);

  const chartData = months.map((month, index) => {
    const monthNumber = now.clone().subtract(4 - index, 'months').month() + 1;

    const users = userGrowth.find(item => item._id === monthNumber)?.count || 0;
    const opportunities = opportunityGrowth.find(item => item._id === monthNumber)?.count || 0;

    return {
      name: month,
      users,
      opportunities,
    };
  });

  return chartData;
};

export { getDashboardStats };
