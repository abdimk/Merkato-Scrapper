import React from 'react';

interface NeoTagProps {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}

export const NeoTag: React.FC<NeoTagProps> = ({ children, onClick, active }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? '#000' : '#fff',
      color: active ? '#fff' : '#000',
      border: '2px solid #000',
      padding: '6px 16px',
      fontWeight: '600',
      fontFamily: 'monospace',
      cursor: 'pointer',
      marginRight: '8px',
      marginBottom: '8px',
      textTransform: 'uppercase',
      fontSize: '0.8rem',
      boxShadow: active ? 'inset 2px 2px 0px #333' : '3px 3px 0px #ccc',
      transition: 'all 0.1s'
    }}
  >
    {children}
  </button>
);