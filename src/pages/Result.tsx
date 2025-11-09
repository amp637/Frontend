import React from 'react';
import Navigation from '../components/Navigation';
import './Result.css';

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  icon: string;
}

interface ResultProps {
  onReset?: () => void;
}

const Result: React.FC<ResultProps> = ({ onReset }) => {
  // 예시 데이터
  const score = 86;
  const scoreRating = 'Good';
  const summary = 'Most issues are related to contrast and small buttons.';
  
  const issues: Issue[] = [
    {
      id: '1',
      title: 'Low contrast text',
      description: "Several text elements don't meet WCAG AA standards for color contrast.",
      severity: 'High',
      icon: '⚠️'
    },
    {
      id: '2',
      title: 'Small touch targets',
      description: 'Multiple buttons are smaller than the recommended 44x44px minimum size.',
      severity: 'High',
      icon: '⚠️'
    },
    {
      id: '3',
      title: 'Missing alt text',
      description: 'Images lack descriptive alternative text for screen readers.',
      severity: 'Medium',
      icon: 'ℹ️'
    },
    {
      id: '4',
      title: 'Unclear form labels',
      description: 'Form inputs are missing visible labels or aria-labels.',
      severity: 'Medium',
      icon: 'ℹ️'
    }
  ];

  const getSeverityClass = (severity: string) => {
    return `badge-${severity.toLowerCase()}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const handleDownloadReport = () => {
    console.log('Download report');
  };

  const handleRunAgain = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="result-page">
      <Navigation />
      <div className="result-container">
        <div className="result-card">
          <div className="result-content">
            {/* 왼쪽: 접근성 점수 */}
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

              <p className="score-summary">{summary}</p>
            </div>

            {/* 오른쪽: 주요 이슈 */}
            <div className="issues-section">
              <h2 className="section-title">Top issues</h2>
              
              <div className="issues-list">
                {issues.map((issue) => (
                  <div key={issue.id} className="issue-item">
                    <div className="issue-content">
                      <div className="issue-icon">{issue.icon}</div>
                      
                      <div className="issue-details">
                        <div className="issue-header">
                          <h3 className="issue-title">{issue.title}</h3>
                          <span className={`severity-badge ${getSeverityClass(issue.severity)}`}>
                            {issue.severity}
                          </span>
                        </div>
                        <p className="issue-description">{issue.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="result-actions">
            <button className="btn-secondary" onClick={handleDownloadReport}>
              Download report
            </button>
            <button className="btn-primary" onClick={handleRunAgain}>
              Run again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;

