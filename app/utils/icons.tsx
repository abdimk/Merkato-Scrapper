import React from 'react';

export const Icons = {
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2 }}>
      <path strokeLinecap="square" strokeLinejoin="miter" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2 }}>
      <path strokeLinecap="square" strokeLinejoin="miter" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Minus: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2 }}>
      <path strokeLinecap="square" strokeLinejoin="miter" d="M20 12H4" />
    </svg>
  ),
  External: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2 }}>
      <path strokeLinecap="square" strokeLinejoin="miter" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ strokeWidth: 2 }}>
      <path strokeLinecap="square" strokeLinejoin="miter" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
};