import React from 'react';

export const PlusIconHome = ({ size = 16, color = "currentColor", className = "" }: { size?: number, color?: string, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-plus ${className}`}>
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
    </svg>
);
