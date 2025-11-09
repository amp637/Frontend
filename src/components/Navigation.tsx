import React from 'react';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <div className="logo-container">
        <span className="logo-sketch">Sketch</span>
        <span className="logo-check">Check</span>
      </div>
    </nav>
  );
};

export default Navigation;

