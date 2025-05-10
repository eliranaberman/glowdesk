
import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, className = '' }) => {
  return (
    <div 
      className={`animate-spin rounded-full border-2 border-background border-t-primary ${className}`} 
      style={{ 
        height: `${size}px`, 
        width: `${size}px` 
      }}
    />
  );
};

export default LoadingSpinner;
