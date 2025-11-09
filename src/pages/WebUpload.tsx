import React from 'react';
import Navigation from '../components/Navigation';
import UploadCard from '../components/UploadCard';
import './WebUpload.css';

interface WebUploadProps {
  onUpload: (file: File) => void;
}

const WebUpload: React.FC<WebUploadProps> = ({ onUpload }) => {
  return (
    <div className="web-upload">
      <Navigation />
      <div className="upload-content">
        <UploadCard onUpload={onUpload} />
      </div>
    </div>
  );
};

export default WebUpload;

