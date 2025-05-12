import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Helper function to format dates consistently
const formatDate = (dateInput) => {
  if (!dateInput) return 'Unknown date';
  
  let dateObj;
  
  // Handle Firestore timestamps
  if (dateInput.toDate && typeof dateInput.toDate === 'function') {
    dateObj = dateInput.toDate();
  } 
  // Handle JavaScript Date objects or ISO strings
  else if (dateInput instanceof Date) {
    dateObj = dateInput;
  } else if (typeof dateInput === 'string') {
    dateObj = new Date(dateInput);
  } else if (dateInput.seconds) { // Firestore timestamp format in JSON
    dateObj = new Date(dateInput.seconds * 1000);
  } else {
    return 'Invalid date';
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

const FeedbackComment = ({ comment, level = 0, onReply, onDelete, onUpvote, onDownvote, user }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  const replyCount = comment.replies ? comment.replies.length : 0;
  const hasReplies = replyCount > 0;
  
  // Check if user has voted
  const isUpvoted = comment.upvotedBy?.includes(user?.uid) || comment.upvoted;
  const isDownvoted = comment.downvotedBy?.includes(user?.uid) || comment.downvoted;

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      await onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
      {!collapsed ? (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              {/* Vote Arrows (Reddit Style) */}
              <div className="flex flex-col items-center mr-2">
                <button 
                  onClick={() => onUpvote(comment.id)}
                  className={`focus:outline-none ${
                    isUpvoted 
                      ? 'text-orange-500' 
                      : 'text-gray-500 hover:text-orange-500'
                  }`}
                >
                  <svg className="h-5 w-5" fill={isUpvoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <span className={`text-xs font-medium my-1 ${
                  comment.votes > 0 
                    ? 'text-orange-500' 
                    : comment.votes < 0 
                      ? 'text-blue-500' 
                      : 'text-gray-500'
                }`}>{comment.votes || 0}</span>
                <button 
                  onClick={() => onDownvote(comment.id)}
                  className={`focus:outline-none ${
                    isDownvoted 
                      ? 'text-blue-500' 
                      : 'text-gray-500 hover:text-blue-500'
                  }`}
                >
                  <svg className="h-5 w-5" fill={isDownvoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {/* User Avatar */}
              {comment.reviewerPhotoURL ? (
                <img 
                  src={comment.reviewerPhotoURL} 
                  alt={comment.reviewerName} 
                  className="h-10 w-10 rounded-full mr-3"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
                  <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                    {comment.reviewerName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div>
                <div className="flex items-center">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white">
                    {comment.reviewerName}
                  </h4>
                  <span className="mx-2 text-xs text-gray-500 dark:text-gray-400">•</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              {/* Collapse button */}
              {hasReplies && (
                <button
                  onClick={() => setCollapsed(true)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mr-3 focus:outline-none"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
                  </svg>
                </button>
              )}
              
              {/* Delete button */}
              {(user && (user.uid === comment.reviewerId)) && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="text-gray-400 hover:text-red-500 focus:outline-none"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {comment.content}
          </div>

          <div className="mt-2 flex items-center space-x-4 text-xs">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
            >
              Reply
            </button>
            
            {hasReplies && (
              <span className="text-gray-500 dark:text-gray-400">
                {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>

          {showReplyForm && (
            <form onSubmit={handleReply} className="mt-3">
              <textarea
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                rows="2"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                required
              />
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {submitting ? 'Submitting...' : 'Reply'}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Collapsed view */
        <div className="flex items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer mb-2" onClick={() => setCollapsed(false)}>
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mr-2 focus:outline-none">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{comment.reviewerName}</span>
          <span className="mx-2 text-xs text-gray-500 dark:text-gray-400">•</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
          </span>
        </div>
      )}

      {/* Render nested replies if not collapsed */}
      {!collapsed && comment.replies && comment.replies.map(reply => (
        <FeedbackComment
          key={reply.id}
          comment={reply}
          level={level + 1}
          onReply={onReply}
          onDelete={onDelete}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
          user={user}
        />
      ))}
    </div>
  );
};

const ResumeFeedback = ({ userId }) => {
  const { user, getAuthHeader } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFeedback, setNewFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'popular'

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const resumeResponse = await axios.get(
          `http://localhost:5001/api/resume/user/${userId}`,
          getAuthHeader()
        );
        
        setResumeData(resumeResponse.data);
        
        const feedbackResponse = await axios.get(
          `http://localhost:5001/api/resume/feedback/${userId}`,
          getAuthHeader()
        );
        
        setFeedback(feedbackResponse.data);
      } catch (err) {
        console.error('Error fetching resume data or feedback:', err);
        setError(err.response?.data?.message || 'Failed to load resume data or feedback');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, userId, getAuthHeader]);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!newFeedback.trim()) {
      setError('Feedback content is required');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axios.post(
        `http://localhost:5001/api/resume/feedback/${userId}`,
        {
          content: newFeedback
        },
        getAuthHeader()
      );
      
      setFeedback([response.data, ...feedback]);
      setNewFeedback('');
      setSuccess('Feedback submitted successfully');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId, content) => {
    try {
      const response = await axios.post(
        `http://localhost:5001/api/resume/feedback/${userId}`,
        {
          content,
          parentId
        },
        getAuthHeader()
      );

      // Update the feedback state to include the new reply
      setFeedback(prevFeedback => {
        const updateFeedback = (comments) => {
          return comments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), response.data]
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateFeedback(comment.replies)
              };
            }
            return comment;
          });
        };
        return updateFeedback(prevFeedback);
      });
    } catch (err) {
      console.error('Error submitting reply:', err);
      throw err;
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }
    
    try {
      await axios.delete(
        `http://localhost:5001/api/resume/feedback/${feedbackId}`,
        getAuthHeader()
      );
      
      // Remove deleted feedback from the list
      setFeedback(prevFeedback => {
        const removeFeedback = (comments) => {
          return comments.filter(comment => {
            if (comment.id === feedbackId) {
              return false;
            }
            if (comment.replies) {
              comment.replies = removeFeedback(comment.replies);
            }
            return true;
          });
        };
        return removeFeedback(prevFeedback);
      });
      
      setSuccess('Feedback deleted successfully');
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError(err.response?.data?.message || 'Failed to delete feedback');
    }
  };

  const handleUpvote = async (feedbackId) => {
    try {
      // Use the backend endpoint to handle voting
      const response = await axios.post(
        `http://localhost:5001/api/resume/feedback/${feedbackId}/upvote`,
        {},
        getAuthHeader()
      );
      
      // Update the feedback state with the new vote count
      setFeedback(prevFeedback => {
        const updateVotes = (comments) => {
          return comments.map(comment => {
            if (comment.id === feedbackId) {
              return {
                ...comment,
                votes: response.data.votes,
                upvoted: response.data.upvoted
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateVotes(comment.replies)
              };
            }
            return comment;
          });
        };
        return updateVotes(prevFeedback);
      });
      
      setSuccess(response.data.message);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Error upvoting feedback:', err);
      setError(err.response?.data?.message || 'Failed to upvote feedback');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDownvote = async (feedbackId) => {
    try {
      // Use the backend endpoint to handle voting
      const response = await axios.post(
        `http://localhost:5001/api/resume/feedback/${feedbackId}/downvote`,
        {},
        getAuthHeader()
      );
      
      // Update the feedback state with the new vote count
      setFeedback(prevFeedback => {
        const updateVotes = (comments) => {
          return comments.map(comment => {
            if (comment.id === feedbackId) {
              return {
                ...comment,
                votes: response.data.votes,
                downvoted: response.data.downvoted
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateVotes(comment.replies)
              };
            }
            return comment;
          });
        };
        return updateVotes(prevFeedback);
      });
      
      setSuccess(response.data.message);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('Error downvoting feedback:', err);
      setError(err.response?.data?.message || 'Failed to downvote feedback');
      setTimeout(() => setError(null), 3000);
    }
  };

  const sortedFeedback = () => {
    if (!feedback || feedback.length === 0) return [];
    
    const feedbackCopy = [...feedback];
    
    switch (sortBy) {
      case 'oldest':
        return feedbackCopy.sort((a, b) => {
          return new Date(a.createdAt?.toDate?.() || a.createdAt) - 
                 new Date(b.createdAt?.toDate?.() || b.createdAt);
        });
      case 'popular':
        return feedbackCopy.sort((a, b) => {
          return (b.votes || 0) - (a.votes || 0);
        });
      case 'newest':
      default:
        return feedbackCopy; // Already sorted by newest in the backend
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error && !resumeData) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {/* Add new feedback form */}
      {user && user.uid !== userId && (
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Add Feedback
          </h3>
          
          <form onSubmit={handleSubmitFeedback}>
            <div className="mb-4">
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your feedback
              </label>
              <textarea
                id="feedback"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Provide constructive feedback on this resume..."
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </form>
        </div>
      )}
      
      {/* Sort options for the feedback thread */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Feedback Thread ({feedback.length})
        </h3>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <div className="relative inline-block text-left">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full pl-3 pr-10 py-1 text-sm border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Feedback thread */}
      {feedback.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No feedback yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Be the first to provide feedback on this resume.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedFeedback().filter(item => !item.parentId).map(item => (
            <FeedbackComment
              key={item.id}
              comment={item}
              onReply={handleReply}
              onDelete={handleDeleteFeedback}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeFeedback; 