import React from 'react';
import Navigation from '../components/Navigation';
import './HistoryResult.css';

interface HistoryResultProps {
  imageUrl: string;
  score: number;
  fileName: string;
  analyzedDate: string;
  userInitial?: string;
  onProfileClick?: () => void;
  onBackToHistory?: () => void;
  onUploadAnother?: () => void;
}

const HistoryResult: React.FC<HistoryResultProps> = ({
  imageUrl,
  score,
  fileName,
  analyzedDate,
  userInitial,
  onProfileClick,
  onBackToHistory,
  onUploadAnother,
}) => {
  // 점수 기반 등급 및 색상 결정
  const getScoreRating = (score: number) => {
    if (score >= 75) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Needs Attention';
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10b981'; // 초록
    if (score >= 40) return '#f59e0b'; // 주황
    return '#ef4444'; // 빨강
  };

  const rating = getScoreRating(score);
  const scoreColor = getScoreColor(score);

  // 날짜 포맷팅 (e.g., "November 30, 2025 at 03:29 PM")
  const formatAnalyzedDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '-';
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="history-result-page">
      {/* Navigation */}
      <Navigation 
        userInitial={userInitial || 'U'} 
        onProfileClick={onProfileClick} 
      />

      {/* Main Content */}
      <div className="history-result-content">
        {/* Back to History Button */}
        <button className="back-to-history-btn" onClick={onBackToHistory}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back to History</span>
        </button>

        {/* Result Card */}
        <div className="history-result-card">
          {/* Header with gradient background */}
          <div className="history-result-header">
            <div className="header-content">
              <div className="header-info">
                <h1 className="header-title">Analysis Result</h1>
                <div className="file-info">
                  <div className="info-row">
                    <span className="info-label">File:</span>
                    <span className="info-value">{fileName}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Analyzed:</span>
                    <span className="info-value">{formatAnalyzedDate(analyzedDate)}</span>
                  </div>
                </div>
              </div>
              <div className="header-score">
                <div 
                  className="score-badge"
                  style={{ backgroundColor: scoreColor, borderColor: scoreColor }}
                >
                  <span className="badge-text">{rating}</span>
                </div>
                <div className="score-number">
                  <div className="score-value" style={{ color: scoreColor }}>{score}</div>
                  <div className="score-total">/100</div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="history-result-image-container">
            <img 
              src={imageUrl} 
              alt="Analyzed accessibility sketch" 
              className="history-result-image"
            />
          </div>

          {/* Footer with Upload Button */}
          <div className="history-result-footer">
            <button className="upload-another-btn" onClick={onUploadAnother}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.3333 5.33333L8 2L4.66667 5.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Upload Another Sketch</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryResult;

