import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import RichTextEditor from '../components/Editor/RichTextEditor';
import { questionsAPI } from '../services/api';
import { X } from 'lucide-react';

const schema = yup.object({
  title: yup.string().required('Title is required').min(10, 'Title must be at least 10 characters'),
  body: yup.string().required('Description is required').min(20, 'Description must be at least 20 characters'),
});

interface FormData {
  title: string;
  body: string;
}

const AskQuestion: React.FC = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onSubmit = async (data: FormData) => {
    if (tags.length === 0) {
      toast.error('Please add at least one tag');
      return;
    }

    if (body.length < 20) {
      toast.error('Description must be at least 20 characters');
      return;
    }

    try {
      setSubmitting(true);
      await questionsAPI.createQuestion({
        title: data.title,
        body: body,
        tags: tags,
      });
      toast.success('Question posted successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to post question');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Ask a Question</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              placeholder="Be specific and imagine you're asking a question to another person"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
            )}
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <RichTextEditor
              value={body}
              onChange={setBody}
              placeholder="Include all the information someone would need to answer your question"
              height="300px"
            />
            {body.length < 20 && body.length > 0 && (
              <p className="mt-1 text-sm text-red-400">
                Description must be at least 20 characters ({body.length}/20)
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-blue-700 rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  placeholder="Add a tag (press Enter or comma to add)"
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={tags.length >= 5}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || tags.length >= 5}
                  className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              <p className="text-sm text-gray-400">
                Add up to 5 tags to describe what your question is about ({tags.length}/5)
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              {submitting ? 'Posting...' : 'Post Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;