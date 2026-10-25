import React from 'react';

export const EraserIcon = ({ size = 20, color = "currentColor", className = "" }: { size?: number, color?: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-eraser ${className}`}>
        <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path>
        <path d="M22 21H7"></path>
        <path d="m5 11 9 9"></path>
    </svg>
);
