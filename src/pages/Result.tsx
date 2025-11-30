import React from 'react';
import Navigation from '../components/Navigation';
import './Result.css';

interface Issue {
  id: string;
  title: string;
  description: string;
  count: number;
}

interface ResultProps {
  onReset?: () => void;
  userInitial?: string;
  onProfileClick?: () => void;
  score?: number;
  scoreRating?: string;
  issues?: Issue[];
  analyzedImageUrl?: string; // 서버에서 받은 분석 이미지 URL
}

const Result: React.FC<ResultProps> = ({ 
  onReset, 
  userInitial, 
  onProfileClick,
  score = 90,
  scoreRating = 'Good',
  issues = [
    {
      id: '1',
      title: 'Touch Target Size',
      description: 'Ensures all interactive elements are large enough to be easily activated. WCAG recommends a minimum target size of 44x44 pixels for touch interfaces.',
      count: 5
    },
    {
      id: '2',
      title: 'Spacing',
      description: 'Adequate spacing between interactive elements prevents accidental activation and improves overall usability for users with motor impairments.',
      count: 3
    },
    {
      id: '3',
      title: 'Input Labels',
      description: 'Every input field should have a clear, visible label or programmatically associated label to help users understand what information is required.',
      count: 2
    }
  ],
  analyzedImageUrl
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const handleRunAgain = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="result-page">
      <Navigation showProfile={true} userInitial={userInitial} onProfileClick={onProfileClick} />
      <div className="result-container">
        <div className="result-card">
          <div className="result-content">
            {/* 왼쪽: 접근성 점수 + 이미지 */}
            <div className="score-section">
              <h2 className="section-title">Accessibility score</h2>
              
              <div className="score-display">
                <div className="score-number-container">
                  <span className="score-number" style={{ color: getScoreColor(score) }}>
                    {score}
                  </span>
                  <span className="score-max">/100</span>
                </div>
              </div>

              <div className={`score-badge badge-${scoreRating.toLowerCase()}`}>
                {scoreRating}
              </div>

              {/* 분석 이미지 표시 */}
              <div className="analyzed-image-container">
                {analyzedImageUrl ? (
                  <img 
                    src={analyzedImageUrl} 
                    alt="Analyzed design with accessibility annotations" 
                    className="analyzed-image"
                  />
                ) : (
                  <div className="image-placeholder">
                    <p>No analyzed image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* 오른쪽: 주요 이슈 */}
            <div className="issues-section">
              <h2 className="section-title">Issues</h2>
              
              <div className="issues-list">
                {issues.map((issue) => (
                  <div key={issue.id} className="issue-item">
                    <div className="issue-header">
                      <h3 className="issue-title">{issue.title}</h3>
                      <span className="issue-count-badge">
                        {issue.count}
                      </span>
                    </div>
                    <p className="issue-description">{issue.description}</p>
                    {/* 선택사항: Full List 버튼 */}
                    {/* <button className="full-list-btn">
                      <span>Full List</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button> */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="result-actions">
            <button className="btn-run-again" onClick={handleRunAgain}>
              Run again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;

