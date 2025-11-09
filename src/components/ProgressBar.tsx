import React, { useEffect, useState } from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress?: number;
  animated?: boolean;
  duration?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress = 0, 
  animated = true,
  duration = 3000 
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      // 자동으로 진행되는 애니메이션
      const interval = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + (100 / (duration / 50));
        });
      }, 50);

      return () => clearInterval(interval);
    } else {
      setCurrentProgress(progress);
    }
  }, [progress, animated, duration]);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-background">
        <div 
          className="progress-bar-fill"
          style={{ width: `${currentProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

