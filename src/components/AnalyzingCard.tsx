import React from 'react';
import ProgressBar from './ProgressBar';
import './AnalyzingCard.css';

const AnalyzingCard: React.FC = () => {
  return (
    <div className="analyzing-card">
      <div className="analyzing-state">
        <div className="analyzing-heading">
          <h1>Analyzing your sketch…</h1>
        </div>
        
        <ProgressBar animated={true} duration={3000} />
        
        <div className="analyzing-paragraph">
          <p>Detecting components and running accessibility checks.</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyzingCard;

