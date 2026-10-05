import React, { memo } from 'react';

interface LogoProps {
  className?: string;
  light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", light = false }) => {
  return (
    <img
      src={light ? "../../assets/images/logo.png" : "../../assets/images/logo.png"}
      alt="Cheruto & Nashali Advocates"
      className={className}
    />
  );
};

export default memo(Logo);