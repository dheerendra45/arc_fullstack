import React, { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { OpportunityService } from '../services';
import toast from 'react-hot-toast';

const Opportunities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalOpportunities, setTotalOpportunities] = useState(0);

  useEffect(() => {
    fetchOpportunities();
  }, [currentPage, statusFilter]); // Refetch when page or status filter changes

  const fetchOpportunities = async () => {
    setIsLoading(true);
    try {
      // Adjust the API call to include pagination parameters
      const status = statusFilter !== 'all' ? statusFilter : '';
      const response = await OpportunityService.getAllOpportunities(status, currentPage, limit);

      // Debug the raw response
      console.log('Full API response:', response);

      // Check if response exists and has data
      if (!response) {
        throw new Error('No response from server');
      }

      // Handle pagination metadata
      let opportunitiesData = [];
      let metaData = { total: 0, page: 1, totalPages: 1 };

      if (Array.isArray(response)) {
        opportunitiesData = response;
      } else if (response.opportunities) {
        opportunitiesData = response.opportunities;
        metaData = response.meta || metaData;
      } else if (response.data?.opportunities) {
        opportunitiesData = response.data.opportunities;
        metaData = response.data.meta || metaData;
      } else {
        opportunitiesData = response.data || [];
      }

      // Update pagination state
      setTotalOpportunities(metaData.total);
      setTotalPages(metaData.totalPages);
      setCurrentPage(metaData.page || currentPage);

      // Transform data for frontend
      const formattedOpportunities = opportunitiesData.map(opp => ({
        ...opp,
        id: opp._id || opp.id, // Handle both _id and id
        organizer: opp.organizerId?.name || 'Unknown Organizer',
        date: opp.createdAt ? new Date(opp.createdAt).toLocaleDateString() : 'N/A'
      }));

      setOpportunities(formattedOpportunities);
      setError(null);
    } catch (err) {
      console.error('Full error details:', err);
      setError(err.message);
      toast.error(err.message.includes('opportunities')
        ? 'Data format error from server'
        : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply client-side filtering for search
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    // No need to filter by status here, we're now doing that server-side
    return matchesSearch;
  });

  const handleStatusChange = async (oppId, newStatus) => {
    try {
      await OpportunityService.updateOpportunityStatus(oppId, newStatus);
      // Update local state to reflect the change
      setOpportunities(opportunities.map(opp =>
        opp.id === oppId ? { ...opp, status: newStatus } : opp
      ));
      toast.success('Status updated successfully');
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const exportCSV = () => {
    const headers = ['Title', 'Organizer', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredOpportunities.map(opp =>
        [opp.title, opp.organizer, opp.status, opp.date].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'opportunities.csv';
    a.click();
  };

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
          onClick={fetchOpportunities}
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
        <h1 className="text-2xl font-semibold text-gray-900">Opportunities Management</h1>
        <button
          onClick={exportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150"
          disabled={filteredOpportunities.length === 0}
        >
          <Download className="h-5 w-5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search opportunities..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No opportunities found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organizer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOpportunities.map((opp) => (
                  <tr key={opp.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{opp.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{opp.organizer}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${opp.status === 'approved' ? 'bg-green-100 text-green-800' :
                          opp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {opp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{opp.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={opp.status}
                        onChange={(e) => handleStatusChange(opp.id, e.target.value)}
                        className="border rounded p-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination component */}
            <div className="flex items-center justify-between mt-6 px-4">
              <div className="text-sm text-gray-500">
                Showing {Math.min((currentPage - 1) * limit + 1, totalOpportunities)} to {Math.min(currentPage * limit, totalOpportunities)} of {totalOpportunities} opportunities
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium
                    ${currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  <span className="mr-1">‹</span> Previous
                </button>

                {/* Page numbers */}
                <div className="hidden md:flex">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic to determine which page numbers to show
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`inline-flex items-center px-4 py-2 border text-sm font-medium
                          ${currentPage === pageNum
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium
                    ${currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Next <span className="ml-1">›</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;