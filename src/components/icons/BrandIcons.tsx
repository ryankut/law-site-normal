import React from 'react';

type IconProps = {
  size?: number;
  className?: string;
};

export const Twitter: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Linkedin: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth={2} />
    <path d="M7 10v7M7 7v.01M11 17v-4.5a1.5 1.5 0 0 1 3 0V17M14 12.5a1.5 1.5 0 0 1 3 0V17" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Instagram: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth={2} />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth={2} />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);