import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowUp, ArrowDown, MessageCircle, Eye, Bookmark, Clock, Check } from 'lucide-react';
import { Question, Answer } from '../types';
import { questionsAPI, answersAPI } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import RichTextEditor from '../components/Editor/RichTextEditor';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQuestion();
      fetchAnswers();
    }
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await questionsAPI.getQuestion(id!);
      setQuestion(response.data.data);
    } catch (error) {
      console.error('Failed to fetch question:', error);
    }
  };

  const fetchAnswers = async () => {
    try {
      // Mock answers for now - replace with actual API call
      setAnswers([]);
    } catch (error) {
      console.error('Failed to fetch answers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!user) {
      toast.error('Please login to answer');
      return;
    }

    if (answerBody.length < 20) {
      toast.error('Answer must be at least 20 characters');
      return;
    }

    try {
      setSubmittingAnswer(true);
      await answersAPI.createAnswer({
        body: answerBody,
        questionId: id!,
      });
      setAnswerBody('');
      toast.success('Answer posted successfully!');
      fetchAnswers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to post answer');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleVote = async (answerId: string, type: 'up' | 'down') => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }

    try {
      await answersAPI.voteAnswer(answerId, type);
      fetchAnswers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to vote');
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!user) {
      toast.error('Please login to accept answers');
      return;
    }

    try {
      await answersAPI.acceptAnswer(answerId);
      fetchAnswers();
      toast.success('Answer accepted!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to accept answer');
    }
  };

  if (loading || !question) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Question */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
        <div className="flex space-x-6">
          {/* Vote column */}
          <div className="flex flex-col items-center space-y-3">
            <button className="text-gray-400 hover:text-green-400 transition-colors">
              <ArrowUp className="w-8 h-8" />
            </button>
            <span className="text-2xl font-bold text-white">{question.votes}</span>
            <button className="text-gray-400 hover:text-red-400 transition-colors">
              <ArrowDown className="w-8 h-8" />
            </button>
            <button className="text-gray-400 hover:text-yellow-400 transition-colors mt-4">
              <Bookmark className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-4">{question.title}</h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{question.views} views</span>
              </div>
            </div>

            <div 
              className="prose prose-invert max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: question.body }}
            />

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {question.author.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-white">{question.author.username}</div>
                  <div className="text-xs">
                    {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>

        {answers.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No answers yet. Be the first to answer!</p>
        ) : (
          <div className="space-y-6">
            {answers.map((answer) => (
              <div key={answer.id} className="border-b border-gray-700 pb-6 last:border-b-0">
                <div className="flex space-x-6">
                  {/* Vote column */}
                  <div className="flex flex-col items-center space-y-2">
                    <button 
                      onClick={() => handleVote(answer.id, 'up')}
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      <ArrowUp className="w-6 h-6" />
                    </button>
                    <span className="text-lg font-bold text-white">{answer.votes}</span>
                    <button 
                      onClick={() => handleVote(answer.id, 'down')}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <ArrowDown className="w-6 h-6" />
                    </button>
                    {answer.isAccepted && (
                      <div className="text-green-400 mt-2">
                        <Check className="w-6 h-6" />
                      </div>
                    )}
                    {user?.id === question.authorId && !answer.isAccepted && (
                      <button
                        onClick={() => handleAcceptAnswer(answer.id)}
                        className="text-gray-400 hover:text-green-400 transition-colors mt-2"
                        title="Accept this answer"
                      >
                        <Check className="w-6 h-6" />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div 
                      className="prose prose-invert max-w-none mb-4"
                      dangerouslySetInnerHTML={{ __html: answer.body }}
                    />
                    
                    <div className="flex justify-end">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {answer.author.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{answer.author.username}</div>
                          <div className="text-xs">
                            {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Answer Form */}
      {user && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
          <h3 className="text-xl font-bold text-white mb-4">Your Answer</h3>
          
          <div className="space-y-4">
            <RichTextEditor
              value={answerBody}
              onChange={setAnswerBody}
              placeholder="Write your answer here..."
              height="250px"
            />
            
            <div className="flex justify-end">
              <button
                onClick={handleSubmitAnswer}
                disabled={submittingAnswer || answerBody.length < 20}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {submittingAnswer ? 'Posting...' : 'Post Answer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {!user && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">You must be logged in to post an answer.</p>
          <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Login to Answer
          </a>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;