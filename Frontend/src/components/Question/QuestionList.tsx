import React, { useState, useEffect } from 'react';
import { Filter, SortAsc } from 'lucide-react';
import QuestionCard from './QuestionCard';
import { Question } from '../../types';
import { questionsAPI } from '../../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface QuestionListProps {
  title?: string;
  filters?: any;
}

const QuestionList: React.FC<QuestionListProps> = ({ title = 'All Questions', filters }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [sortBy, filters]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionsAPI.getQuestions({ sort: sortBy, ...filters });
      // The backend returns: { success, count, total, pagination, data: { questions } }
      setQuestions(response.data.data.questions || []);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'votes', label: 'Most Votes' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'unanswered', label: 'Unanswered' },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-900 border border-gray-700 rounded-lg p-6 animate-pulse">
            <div className="flex space-x-4">
              <div className="w-16 h-16 bg-gray-800 rounded"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-800 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tag
              </label>
              <input
                type="text"
                placeholder="Filter by tag..."
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Author
              </label>
              <input
                type="text"
                placeholder="Filter by author..."
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All</option>
                <option value="answered">Answered</option>
                <option value="unanswered">Unanswered</option>
                <option value="accepted">Has Accepted Answer</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No questions found.</p>
          </div>
        ) : (
          questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionList;