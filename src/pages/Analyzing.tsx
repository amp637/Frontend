import React from 'react';
import Navigation from '../components/Navigation';
import AnalyzingCard from '../components/AnalyzingCard';
import './Analyzing.css';

const Analyzing: React.FC = () => {
  return (
    <div className="analyzing-page">
      <Navigation />
      <div className="analyzing-content">
        <AnalyzingCard />
      </div>
    </div>
  );
};

export default Analyzing;

