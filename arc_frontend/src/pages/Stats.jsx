import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Briefcase, UserX } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsService from '../services/StatsService';
import toast from 'react-hot-toast';

const Stats = () => {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalOpportunities: 0,
    deletedUsers: 0,
    chartData: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
  setIsLoading(true);
  try {
    const response = await StatsService.getDashboardStats();
    console.log('Response from stats API:', response);

    const data = response.data;
    console.log('Stats data:', data);

    setStatsData({
      totalUsers: data.totalUsers || 0,
      activeUsers: data.activeUsers || 0,
      totalOpportunities: data.totalOpportunities || 0,
      deletedUsers: data.deletedUsers || 0,
      chartData: data.chartData || []
    });

    setError(null);
  } catch (err) {
    console.error('Error fetching statistics:', err);
    setError('Failed to load statistics');
    toast.error('Failed to load statistics');
  } finally {
    setIsLoading(false);
  }
};

  const stats = [
    {
      name: 'Total Users',
      value: statsData.totalUsers,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Users',
      value: statsData.activeUsers,
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      name: 'Total Opportunities',
      value: statsData.totalOpportunities,
      icon: Briefcase,
      color: 'bg-purple-500'
    },
    {
      name: 'Deleted Users',
      value: statsData.deletedUsers,
      icon: UserX,
      color: 'bg-red-500'
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={fetchStatistics}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Growth Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statsData.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#3B82F6" name="Users" />
              <Bar dataKey="opportunities" fill="#8B5CF6" name="Opportunities" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats;