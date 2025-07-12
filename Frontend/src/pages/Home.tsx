import React from 'react';
import QuestionList from '../components/Question/QuestionList';

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <QuestionList title="Recent Questions" />
    </div>
  );
};

export default Home;