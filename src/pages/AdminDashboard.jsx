import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import { Link } from 'react-router-dom';

// List of admin user IDs - replace with your admin user IDs
const ADMIN_USER_IDS = ['FwIvYUynY6anohhwr6C3LSvqs4V2'];

const AdminDashboard = () => {
  const { user, getAuthHeader } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [contributions, setContributions] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    totalPrograms: 0
  });
  const [recentContributions, setRecentContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateStatus, setUpdateStatus] = useState({ id: null, loading: false });
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    hasMore: false,
    totalCount: 0,
    lastId: null
  });
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [applicationMonth, setApplicationMonth] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [success, setSuccess] = useState('');

  const isAdmin = user && ADMIN_USER_IDS.includes(user.uid);

  // Define fetchDashboardStats as a memoized callback
  const fetchDashboardStats = useCallback(async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        'http://localhost:5001/api/admin/dashboard-stats',
        getAuthHeader()
      );
      
      setStats(response.data.stats);
      setRecentContributions(response.data.recentContributions);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to load dashboard statistics. Please try again later.");
    }
  }, [isAdmin, getAuthHeader]);

  // Fetch dashboard statistics
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Fetch contributions based on status filter
  useEffect(() => {
    const fetchContributions = async () => {
      if (!isAdmin || activeTab !== 'contributions') {
        return;
      }

      try {
        setLoading(true);
        setError("");
        
        const response = await axios.get(
          `http://localhost:5001/api/admin/contributions?status=${statusFilter}&limit=10`,
          getAuthHeader()
        );
        
        setContributions(response.data.contributions);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Error fetching contributions:", err);
        setError("Failed to load contributions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [user, isAdmin, activeTab, statusFilter, getAuthHeader]);

  const loadMoreContributions = async () => {
    if (!pagination.hasMore || !pagination.lastId) return;
    
    try {
      const response = await axios.get(
        `http://localhost:5001/api/admin/contributions?status=${statusFilter}&limit=10&lastId=${pagination.lastId}`,
        getAuthHeader()
      );
      
      setContributions([...contributions, ...response.data.contributions]);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Error loading more contributions:", err);
      setError("Failed to load more contributions. Please try again later.");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!isAdmin) return;
    
    // For approval, we need an application month
    if (newStatus === 'approved' && !applicationMonth && !selectedContribution) {
      const contribution = contributions.find(c => c.id === id);
      setSelectedContribution(contribution);
      setModalOpen(true);
      return;
    }
    
    // For rejection, we need a reason
    if (newStatus === 'rejected' && !rejectionReason && !selectedContribution) {
      const contribution = contributions.find(c => c.id === id);
      setSelectedContribution(contribution);
      setModalOpen(true);
      return;
    }
    
    try {
      setUpdateStatus({ id, loading: true });
      
      // Prepare the request data based on the status
      const requestData = {
        status: newStatus
      };
      
      // Add application month for approvals
      if (newStatus === 'approved') {
        requestData.applicationMonth = applicationMonth;
      }
      
      // Add rejection reason for rejections
      if (newStatus === 'rejected') {
        requestData.reason = rejectionReason;
      }
      
      // Make the API call to update status
      await axios.put(
        `http://localhost:5001/api/admin/contributions/${id}/status`,
        requestData,
        getAuthHeader()
      );
      
      // Update the local state to reflect the change
      setContributions(prevContributions => 
        prevContributions.map(contribution => 
          contribution.id === id 
            ? { 
                ...contribution, 
                status: newStatus,
                ...(newStatus === 'approved' && { applicationMonth }),
                ...(newStatus === 'rejected' && { rejectionReason })
              } 
            : contribution
        )
      );
      
      // If we're in the modal, close it
      if (modalOpen) {
        setModalOpen(false);
        setSelectedContribution(null);
        setApplicationMonth('');
        setRejectionReason('');
      }
      
      // Update dashboard stats
      fetchDashboardStats();
      
      // Show success message
      setSuccess(`Contribution ${newStatus === 'approved' ? 'approved' : newStatus === 'rejected' ? 'rejected' : 'updated'} successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(`Error updating contribution status to ${newStatus}:`, err);
      setError(`Failed to update contribution status: ${err.response?.data?.message || err.message}`);
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(''), 5000);
    } finally {
      setUpdateStatus({ id: null, loading: false });
    }
  };

  const handleDeleteContribution = async (id) => {
    if (!isAdmin) return;
    
    if (!window.confirm('Are you sure you want to delete this contribution? This action cannot be undone.')) {
      return;
    }
    
    try {
      setUpdateStatus({ id, loading: true });
      
      // Make the API call to delete the contribution
      await axios.delete(
        `http://localhost:5001/api/admin/contributions/${id}`,
        getAuthHeader()
      );
      
      // Remove the contribution from the local state
      setContributions(prevContributions => 
        prevContributions.filter(contribution => contribution.id !== id)
      );
      
      // If we're in the modal, close it
      if (modalOpen) {
        setModalOpen(false);
        setSelectedContribution(null);
      }
      
      // Update dashboard stats
      fetchDashboardStats();
      
      // Show success message
      setSuccess('Contribution deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting contribution:', err);
      setError(`Failed to delete contribution: ${err.response?.data?.message || err.message}`);
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(''), 5000);
    } finally {
      setUpdateStatus({ id: null, loading: false });
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-800 dark:text-red-200 p-4 rounded">
          <p>Access denied. You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Admin Dashboard</h1>
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'overview'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'contributions'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          onClick={() => {
            setActiveTab('contributions');
            setStatusFilter('all');
          }}
        >
          Contributions
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:text-red-200 dark:border-red-800">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Pending Contributions</h3>
              <p className="text-3xl font-bold mt-2 text-yellow-500">{stats.pending}</p>
              <button 
                onClick={() => {
                  setActiveTab('contributions');
                  setStatusFilter('pending');
                }}
                className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all pending
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Approved Contributions</h3>
              <p className="text-3xl font-bold mt-2 text-green-500">{stats.approved}</p>
              <button 
                onClick={() => {
                  setActiveTab('contributions');
                  setStatusFilter('approved');
                }}
                className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all approved
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Rejected Contributions</h3>
              <p className="text-3xl font-bold mt-2 text-red-500">{stats.rejected}</p>
              <button 
                onClick={() => {
                  setActiveTab('contributions');
                  setStatusFilter('rejected');
                }}
                className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all rejected
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Programs</h3>
              <p className="text-3xl font-bold mt-2 text-blue-500">{stats.totalPrograms}</p>
              <Link 
                to="/programs"
                className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all programs
              </Link>
            </div>
          </div>
          
          {/* Recent Contributions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Recent Contributions</h2>
            
            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : recentContributions.length === 0 ? (
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
                <p className="dark:text-white">No recent contributions found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Program</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contributor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentContributions.map((contribution) => (
                      <tr key={contribution.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-white">{contribution.name}</span>
                            <a 
                              href={contribution.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {contribution.website}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">{contribution.userDisplayName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{contribution.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(contribution.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            contribution.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                            contribution.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedContribution(contribution);
                              setModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Contributions Tab */}
      {activeTab === 'contributions' && (
        <div>
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center mb-6 gap-4">
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Filter by Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Contributions</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
              Showing {contributions.length} of {pagination.totalCount} contributions
            </div>
          </div>
          
          {/* Contributions Table */}
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : contributions.length === 0 ? (
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg text-center">
              <p className="dark:text-white">No contributions found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Program</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contributor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {contributions.map((contribution) => (
                      <tr key={contribution.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-white">{contribution.name}</span>
                            <a 
                              href={contribution.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {contribution.website}
                            </a>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                              {contribution.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">{contribution.userDisplayName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{contribution.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(contribution.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            contribution.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                            contribution.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
                          </span>
                          {contribution.status === 'rejected' && contribution.rejectionReason && (
                            <div className="text-xs text-red-500 mt-1">
                              Reason: {contribution.rejectionReason}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedContribution(contribution);
                                setModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              View
                            </button>
                            {contribution.status !== 'approved' && (
                              <button
                                onClick={() => {
                                  setSelectedContribution(contribution);
                                  setModalOpen(true);
                                  setApplicationMonth('');
                                }}
                                disabled={updateStatus.id === contribution.id && updateStatus.loading}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              >
                                Approve
                              </button>
                            )}
                            {contribution.status !== 'rejected' && (
                              <button
                                onClick={() => {
                                  setSelectedContribution(contribution);
                                  setModalOpen(true);
                                  setRejectionReason('');
                                }}
                                disabled={updateStatus.id === contribution.id && updateStatus.loading}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Reject
                              </button>
                            )}
                            {contribution.status !== 'pending' && (
                              <button
                                onClick={() => handleStatusUpdate(contribution.id, 'pending')}
                                disabled={updateStatus.id === contribution.id && updateStatus.loading}
                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                              >
                                Reset
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteContribution(contribution.id)}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {pagination.hasMore && (
                <div className="mt-6 text-center">
                  <button
                    onClick={loadMoreContributions}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {/* Contribution Detail Modal */}
      {modalOpen && selectedContribution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold dark:text-white">Contribution Details</h2>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setSelectedContribution(null);
                    setApplicationMonth('');
                    setRejectionReason('');
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold dark:text-white">{selectedContribution.name}</h3>
                <a 
                  href={selectedContribution.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {selectedContribution.website}
                </a>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Submitted by</p>
                    <p className="dark:text-white">{selectedContribution.userDisplayName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedContribution.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Submission Date</p>
                    <p className="dark:text-white">{formatDate(selectedContribution.createdAt)}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedContribution.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    selectedContribution.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {selectedContribution.status.charAt(0).toUpperCase() + selectedContribution.status.slice(1)}
                  </span>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                  <p className="dark:text-white whitespace-pre-line">{selectedContribution.description}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Actions</h3>
                
                {/* Approve Form */}
                {selectedContribution.status !== 'approved' && (
                  <div className="mb-4">
                    <label htmlFor="applicationMonth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Application Month (required for approval)
                    </label>
                    <select
                      id="applicationMonth"
                      value={applicationMonth}
                      onChange={(e) => setApplicationMonth(e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                    
                    <button
                      onClick={() => handleStatusUpdate(selectedContribution.id, 'approved')}
                      disabled={!applicationMonth || (updateStatus.id === selectedContribution.id && updateStatus.loading)}
                      className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateStatus.id === selectedContribution.id && updateStatus.loading ? 'Processing...' : 'Approve Contribution'}
                    </button>
                  </div>
                )}
                
                {/* Reject Form */}
                {selectedContribution.status !== 'rejected' && (
                  <div className="mb-4">
                    <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rejection Reason
                    </label>
                    <textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide a reason for rejection"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                      rows={3}
                    ></textarea>
                    
                    <button
                      onClick={() => handleStatusUpdate(selectedContribution.id, 'rejected')}
                      disabled={!rejectionReason || (updateStatus.id === selectedContribution.id && updateStatus.loading)}
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateStatus.id === selectedContribution.id && updateStatus.loading ? 'Processing...' : 'Reject Contribution'}
                    </button>
                  </div>
                )}
                
                {/* Reset Status */}
                {selectedContribution.status !== 'pending' && (
                  <div className="mb-4">
                    <button
                      onClick={() => handleStatusUpdate(selectedContribution.id, 'pending')}
                      disabled={updateStatus.id === selectedContribution.id && updateStatus.loading}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateStatus.id === selectedContribution.id && updateStatus.loading ? 'Processing...' : 'Reset to Pending'}
                    </button>
                  </div>
                )}
                
                {/* Delete Contribution */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      handleDeleteContribution(selectedContribution.id);
                      setModalOpen(false);
                    }}
                    disabled={updateStatus.id === selectedContribution.id && updateStatus.loading}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateStatus.id === selectedContribution.id && updateStatus.loading ? 'Processing...' : 'Delete Contribution'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Admin Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Email notifications for new contributions
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="dashboardNotifications"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="dashboardNotifications" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Dashboard notifications
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Admin Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="defaultTab" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Default Dashboard Tab
                  </label>
                  <select
                    id="defaultTab"
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    defaultValue="overview"
                  >
                    <option value="overview">Overview</option>
                    <option value="contributions">Contributions</option>
                    <option value="settings">Settings</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Items Per Page
                  </label>
                  <select
                    id="itemsPerPage"
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    defaultValue="10"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;