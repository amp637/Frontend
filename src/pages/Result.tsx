import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import type { UploadResponseItem, ProcessedIssue } from '../types/upload';
import './Result.css';

interface ResultProps {
  onReset?: () => void;
  userInitial?: string;
  onProfileClick?: () => void;
  uploadResult?: UploadResponseItem | null; // 백엔드 응답 전체
}

const Result: React.FC<ResultProps> = ({ 
  onReset, 
  userInitial, 
  onProfileClick,
  uploadResult
}) => {
  // 각 이슈별 확장/축소 상태 관리
  const [expandedIssues, setExpandedIssues] = useState<{ [key: string]: boolean }>({});
  const [processedIssues, setProcessedIssues] = useState<ProcessedIssue[]>([]);
  const [score, setScore] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>('');

  // uploadResult가 변경될 때마다 데이터 처리
  useEffect(() => {
    if (!uploadResult) return;

    // 1. 점수 추출
    const analysisScore = uploadResult.ai_result.analysis.summary.score;
    setScore(analysisScore);

    // 2. 이미지 URL 추출
    // 메인 이미지는 AI 모델이 처리한 debug_image_url을 우선 사용, 없으면 원본 image_url로 폴백
    const mainImageSrc = uploadResult.debug_image_url || uploadResult.image_url;
    setImageUrl(mainImageSrc);

    // 3. violations 배열에서 각 rule별로 개수 계산
    const violations = uploadResult.ai_result.analysis.violations;
    
    // Target Size 이슈 개수
    const targetSizeCount = violations.filter(v => v.rule === 'target_size').length;
    
    // Spacing 이슈 개수
    const spacingCount = violations.filter(v => v.rule === 'spacing').length;
    
    // Label Pairing 이슈 개수
    const labelPairingCount = uploadResult.ai_result.analysis.label_pairing_result.violations.length;

    // 4. Spacing 세부 항목 (Full List)
    const spacingDetails = uploadResult.ai_result.analysis.spacing_result.violations.map(v => 
      `${v.classes.join(' - ')} (distance: ${v.distance.toFixed(2)}px)`
    );

    // 5. Target Size 세부 항목 (Full List)
    const targetSizeDetails = uploadResult.ai_result.analysis.target_size_result.violations.map(v =>
      v.detail
    );

    // 6. Label Pairing 세부 항목 (현재는 비어있지만 구조는 유지)
    const labelPairingDetails = uploadResult.ai_result.analysis.label_pairing_result.violations.map((_violation: any, idx: number) =>
      `Issue ${idx + 1}`
    );

    // 7. ProcessedIssue 배열 생성
    const issues: ProcessedIssue[] = [
      {
        id: '1',
        title: 'Touch Target Size',
        description: 'Ensures all interactive elements are large enough to be easily activated. WCAG recommends a minimum target size of 44x44 pixels for touch interfaces.',
        count: targetSizeCount,
        details: targetSizeDetails.length > 0 ? targetSizeDetails : undefined
      },
      {
        id: '2',
        title: 'Spacing',
        description: 'Adequate spacing between interactive elements prevents accidental activation and improves overall usability for users with motor impairments.',
        count: spacingCount,
        details: spacingDetails.length > 0 ? spacingDetails : undefined
      },
      {
        id: '3',
        title: 'Input Labels',
        description: 'Every input field should have a clear, visible label or programmatically associated label to help users understand what information is required.',
        count: labelPairingCount,
        details: labelPairingDetails.length > 0 ? labelPairingDetails : undefined
      }
    ];

    setProcessedIssues(issues);
  }, [uploadResult]);

  // 점수 범위에 따른 색상 (0-39: 빨강, 40-74: 주황, 75-100: 초록)
  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10b981'; // 초록 (Good)
    if (score >= 40) return '#f59e0b'; // 주황 (Needs Improvement)
    return '#ef4444'; // 빨강 (Needs Attention)
  };

  // 점수 범위에 따른 등급 자동 설정
  const getScoreRating = (score: number) => {
    if (score >= 75) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Needs Attention';
  };

  const scoreRating = getScoreRating(score);

  // Full List 토글
  const toggleIssueDetails = (issueId: string) => {
    setExpandedIssues(prev => ({
      ...prev,
      [issueId]: !prev[issueId]
    }));
  };

  const handleRunAgain = () => {
    if (onReset) {
      onReset();
    }
  };

  // 데이터가 없으면 로딩 표시
  if (!uploadResult) {
    return (
      <div className="result-page">
        <Navigation showProfile={true} userInitial={userInitial} onProfileClick={onProfileClick} />
        <div className="result-container">
          <div className="result-card">
            <p>Loading result...</p>
          </div>
        </div>
      </div>
    );
  }

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

              <div className={`score-badge badge-${scoreRating.toLowerCase().replace(/\s+/g, '-')}`}>
                {scoreRating}
              </div>

              {/* AI 모델이 처리한 분석 이미지 표시 (debug_image_url 우선) */}
              <div className="analyzed-image-container">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt="Accessibility analyzed sketch with annotations" 
                    className="analyzed-image"
                  />
                ) : (
                  <div className="image-placeholder">
                    <p>No image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* 오른쪽: 주요 이슈 */}
            <div className="issues-section">
              <h2 className="section-title">Issues</h2>
              
              <div className="issues-list">
                {processedIssues.map((issue) => (
                  <div key={issue.id} className="issue-item">
                    <div className="issue-header">
                      <h3 className="issue-title">{issue.title}</h3>
                      <span className="issue-count-badge">
                        {issue.count}
                      </span>
                    </div>
                    <p className="issue-description">{issue.description}</p>
                    
                    {/* 세부 항목이 있는 경우 Full List 버튼 표시 */}
                    {issue.details && issue.details.length > 0 && (
                      <div className="full-list-section">
                        {/* Full List 토글 버튼 */}
                        <button 
                          className="full-list-btn"
                          onClick={() => toggleIssueDetails(issue.id)}
                        >
                          <span>{expandedIssues[issue.id] ? 'Close' : 'Full List'}</span>
                          <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 16 16" 
                            fill="none"
                            style={{ 
                              transform: expandedIssues[issue.id] ? 'rotate(90deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s'
                            }}
                          >
                            <path 
                              d="M6 12L10 8L6 4" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        
                        {/* 확장된 상세 목록 */}
                        {expandedIssues[issue.id] && (
                          <div className="issue-details-container">
                            <ul className="issue-details-list">
                              {issue.details.map((detail, idx) => (
                                <li key={idx} className="issue-detail-item">
                                  {detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
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

