import React from 'react';
import type { MenuActionProps } from './types';

export const MenuAction: React.FC<MenuActionProps> = ({ onClick, label, color = '#334155' }) => (
    <button 
        style={{ 
            padding: '8px 12px', 
            textAlign: 'left', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '14px',
            color,
            fontWeight: 500,
            borderRadius: '4px',
        }}
        onClick={onClick}
        onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
        onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
    >
        {label}
    </button>
);
