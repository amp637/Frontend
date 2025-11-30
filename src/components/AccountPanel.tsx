import React from 'react';
import './AccountPanel.css';

interface UploadHistory {
  id: number;
  s3_url: string;
  debug_image_url: string | null;
  score: number;
  created_at: string;
  fileName: string;
}

interface AccountPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
  userInitial?: string;
  uploadHistory?: UploadHistory[];
  onLogout?: () => void;
  onHistoryClick?: (item: UploadHistory) => void;
}

const AccountPanel: React.FC<AccountPanelProps> = ({
  isOpen,
  onClose,
  userName = 'Alex Johnson',
  userEmail = 'alex.johnson@example.com',
  userInitial = 'A',
  uploadHistory = [],
  onLogout,
  onHistoryClick
}) => {
  if (!isOpen) return null;

  // 안전한 날짜 포맷팅 함수
  const formatUploadDate = (createdAt: string) => {
    if (!createdAt) return '-';
    
    const date = new Date(createdAt);
    
    // 유효한 날짜인지 확인
    if (Number.isNaN(date.getTime())) {
      return '-';
    }
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      {/* Overlay */}
      <div className="account-panel-overlay" onClick={onClose}></div>
      
      {/* Panel */}
      <div className={`account-panel ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="account-panel-header">
          <div className="account-header-content">
            <h2 className="account-header-title">Your Account</h2>
            <button className="close-icon-button" onClick={onClose}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4L12 12" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          {/* User Info */}
          <div className="user-info-container">
            <div className="user-avatar-large">
              <span className="user-avatar-initial">{userInitial}</span>
            </div>
            <div className="user-details">
              <div className="user-name">{userName}</div>
              <div className="user-email">{userEmail}</div>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="history-section">
          <div className="history-header">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8Z" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 5V8L10 10" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="history-title">Upload History</h3>
          </div>
          
          <div className="history-content">
            {uploadHistory.length === 0 ? (
              /* Empty State */
              <div className="history-empty-state">
                <div className="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="10" width="32" height="28" rx="2" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 22L24 30L32 22" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 30V14" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="empty-title">No history yet</p>
                <p className="empty-description">Your uploaded sketches will appear here</p>
              </div>
            ) : (
              /* History List */
              <div className="history-list">
                {uploadHistory.map((item) => (
                  <div 
                    key={item.id} 
                    className="history-item"
                    onClick={() => onHistoryClick?.(item)}
                    style={{ cursor: onHistoryClick ? 'pointer' : 'default' }}
                  >
                    <div className="history-item-content">
                      <div className="history-item-info">
                        <p className="history-item-filename">{item.fileName}</p>
                        <p className="history-item-date">{formatUploadDate(item.created_at)}</p>
                      </div>
                      <div className="history-item-score">
                        <span className="score-value">{item.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="account-panel-footer">
          {onLogout && (
            <button className="logout-button" onClick={onLogout}>
              Log Out
            </button>
          )}
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default AccountPanel;

