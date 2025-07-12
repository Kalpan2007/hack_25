import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, MessageCircle, Eye, Bookmark, Clock } from 'lucide-react';
import { Question } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
      <div className="flex space-x-4">
        {/* Vote and stats column */}
        <div className="flex flex-col items-center space-y-3 text-gray-400">
          <div className="flex flex-col items-center">
            <ArrowUp className="w-5 h-5 cursor-pointer hover:text-green-400 transition-colors" />
            <span className="text-lg font-semibold">{question.votes}</span>
            <ArrowDown className="w-5 h-5 cursor-pointer hover:text-red-400 transition-colors" />
          </div>
          
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{question.answersCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{question.views}</span>
            </div>
          </div>
        </div>

        {/* Content column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <Link
              to={`/questions/${question.id}`}
              className="text-xl font-semibold text-white hover:text-blue-400 transition-colors leading-tight"
            >
              {question.title}
            </Link>
            <button className="text-gray-400 hover:text-yellow-400 transition-colors ml-4">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>

          <div
            className="mt-3 text-gray-300 line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: question.body.length > 200 
                ? `${question.body.substring(0, 200)}...` 
                : question.body
            }}
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/tags/${tag}`}
                  className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-sm hover:bg-blue-600/30 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>
                  {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                </span>
              </div>
              <Link
                to={`/users/${question.author.id}`}
                className="flex items-center space-x-2 hover:text-white transition-colors"
              >
                <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {question.author.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span>{question.author.username}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;