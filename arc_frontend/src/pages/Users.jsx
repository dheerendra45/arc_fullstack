import React, { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  // Use useCallback to prevent recreation of function on every render
  const fetchUsers = useCallback(async () => {
  console.log('Starting fetchUsers with state:', {
    page: pagination.page,
    limit: pagination.limit,
    roleFilter,
    searchTerm
  });

  setIsLoading(true);
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    UserService.setAuthHeader(token);

    // Create params object matching backend expectations
    const params = {
      page: Number(pagination.page),  // Ensure numeric values
      limit: Number(pagination.limit) // Ensure numeric values
    };

    // Only add role if it's not empty
    if (roleFilter) {
      params.role = roleFilter;
    }

    // If search term exists, add it
    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    console.log('Fetching with params:', params);
    const response = await UserService.getAllUsers(params);
    console.log('API response:', response);

    // Handle the response data
    if (!response.users || !Array.isArray(response.users)) {
      console.error('Invalid user data format:', response);
      throw new Error('Invalid user data received');
    }

    const formattedUsers = response.users.map(user => ({
      ...user,
      status: user.isDeleted ? 'deleted' : 'active'
    }));

    console.log('Formatted users:', formattedUsers.length, 'users');
    setUsers(formattedUsers);

    // Update pagination with response meta
    const newPagination = {
      ...pagination,
      total: Number(response.meta.total) || 0,
      totalPages: Number(response.meta.totalPages) || 1
    };

    console.log('Setting new pagination:', newPagination);
    setPagination(newPagination);

    setError(null);
  } catch (err) {
    console.error('Error fetching users:', err);
    const errorMsg = err.response?.data?.message || err.message || 'Failed to load users';
    setError(errorMsg);
    toast.error(errorMsg);
  } finally {
    setIsLoading(false);
  }
}, [pagination.page, pagination.limit, roleFilter, searchTerm]);
  // Effect to fetch users when dependencies change
  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser, fetchUsers]);

  const handleDelete = async (userId) => {
    try {
      if (!userId) {
        throw new Error('No user ID provided');
      }

      await UserService.softDeleteUser(userId);
      toast.success('User deleted successfully');
      // Refresh users to update pagination
      fetchUsers();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message);
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Status'];
    const csvContent = [
      headers.join(','),
      ...users.map(user =>
        [user.name || '', user.email || '', user.role || '', user.status || ''].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePageChange = (newPage) => {
  console.log('Changing page to:', newPage);
  // Convert to number to ensure proper comparison
  const numericNewPage = Number(newPage);
  const numericTotalPages = Number(pagination.totalPages);

  console.log('Page validation:', {
    numericNewPage,
    numericTotalPages,
    isValid: numericNewPage >= 1 && numericNewPage <= numericTotalPages
  });

  if (numericNewPage >= 1 && numericNewPage <= numericTotalPages) {
    setPagination(prev => {
      console.log('Setting page from', prev.page, 'to', numericNewPage);
      return { ...prev, page: numericNewPage };
    });
    window.scrollTo(0, 0); // Scroll to top when page changes
  }
};
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
    fetchUsers();
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
  };

  // Generate page numbers for pagination (Flipkart style)
  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Show ellipsis if needed before middle pages
    if (currentPage > 3) {
      pageNumbers.push('...');
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i !== 1 && i !== totalPages) { // Skip first and last as they're always shown
        pageNumbers.push(i);
      }
    }

    // Show ellipsis if needed after middle pages
    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // If not authenticated, show message
  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">You need to be logged in to view this page</p>
      </div>
    );
  }

  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Users Management</h1>
        <button
          onClick={exportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150"
          disabled={users.length === 0}
        >
          <Download className="h-5 w-5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full border rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700"
            >
              Search
            </button>
          </form>
          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={roleFilter}
            onChange={handleRoleFilterChange}
          >
            <option value="">All Roles</option>
            <option value="player">Player</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {users.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'organizer' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={user.status === 'deleted'}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Enhanced Pagination Controls - Flipkart style */}
            {pagination.totalPages > 0 && (
              <div className="mt-6 border-t pt-4">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} users
                  </div>

                  <div className="flex items-center justify-center">
                    {/* Previous button */}
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className={`flex items-center px-3 py-1 rounded-l-md border ${
                        pagination.page <= 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">Previous</span>
                    </button>

                    {/* Page numbers */}
                    <div className="hidden sm:flex">
                      {getPageNumbers().map((pageNum, idx) => (
                        pageNum === '...' ? (
                          <span key={`ellipsis-${idx}`} className="px-3 py-1 border-t border-b text-gray-500">
                            ...
                          </span>
                        ) : (
                          <button
                            key={`page-${pageNum}`}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 border-t border-b ${
                              pagination.page === pageNum
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-indigo-600 hover:bg-indigo-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      ))}
                    </div>

                    {/* Mobile page indicator */}
                    <div className="flex sm:hidden border-t border-b px-3 py-1">
                      <span>Page {pagination.page} of {pagination.totalPages}</span>
                    </div>

                    {/* Next button */}
                    <button
  onClick={() => handlePageChange(pagination.page + 1)}
  disabled={Number(pagination.page) >= Number(pagination.totalPages)}
  className={`flex items-center px-3 py-1 rounded-r-md border ${
    Number(pagination.page) >= Number(pagination.totalPages)
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : 'bg-white text-indigo-600 hover:bg-indigo-50'
  }`}
>
  <span className="mr-1 hidden sm:inline">Next</span>
  <ChevronRight className="h-4 w-4" />
</button>
                  </div>
                </div>

                {/* Show page numbers in mobile view */}
                <div className="flex sm:hidden justify-center mt-4">
                  <div className="flex flex-wrap justify-center">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(num => num === 1 || num === pagination.totalPages ||
                              (num >= pagination.page - 1 && num <= pagination.page + 1))
                      .map((num, idx, arr) => {
                        // Add ellipsis
                        if (idx > 0 && num - arr[idx - 1] > 1) {
                          return (
                            <React.Fragment key={`mobile-page-${num}`}>
                              <span className="mx-1 px-2 py-1 text-gray-500">...</span>
                              <button
                                onClick={() => handlePageChange(num)}
                                className={`mx-1 px-3 py-1 rounded border ${
                                  pagination.page === num
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-indigo-600'
                                }`}
                              >
                                {num}
                              </button>
                            </React.Fragment>
                          );
                        }
                        return (
                          <button
                            key={`mobile-page-${num}`}
                            onClick={() => handlePageChange(num)}
                            className={`mx-1 px-3 py-1 rounded border ${
                              pagination.page === num
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-indigo-600'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Users;