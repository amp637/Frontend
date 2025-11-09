import React, { useState, useRef } from 'react';
import './UploadCard.css';

interface UploadCardProps {
  onUpload: (file: File) => void;
}

const UploadCard: React.FC<UploadCardProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    
    // 파일 유효성 검사
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('PNG 또는 JPG 파일만 업로드할 수 있습니다.');
      return;
    }

    // 파일 업로드 콜백 호출
    onUpload(file);
  };

  return (
    <div className="upload-card">
      <div className="upload-state">
        <div className="container">
          <div className="heading">
            <h1>Upload your UI sketch</h1>
          </div>
          <div className="paragraph">
            <p>
              Take a photo or export an image of your hand-drawn wireframe. 
              We'll analyze common accessibility issues.
            </p>
          </div>
        </div>

        <div 
          className={`upload-container ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="upload-label">
            <div className="icon-container">
              <div className="upload-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M20 13.3333V26.6666M20 13.3333L25 18.3333M20 13.3333L15 18.3333M33.3333 20C33.3333 27.3638 27.3638 33.3333 20 33.3333C12.6362 33.3333 6.66666 27.3638 6.66666 20C6.66666 12.6362 12.6362 6.66666 20 6.66666C27.3638 6.66666 33.3333 12.6362 33.3333 20Z" 
                    stroke="white" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <p className="upload-text">Click to upload or drag & drop</p>
            <p className="upload-info">PNG, JPG, up to 10MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="footer-text">
        <p>We check tappability.</p>
      </div>
    </div>
  );
};

export default UploadCard;

