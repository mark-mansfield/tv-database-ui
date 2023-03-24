import React from 'react';
import'./style.scss'
export const Meta: React.FC<{ length: number; query: string }> = ({ length, query }) => {
  return (
    <div className="meta__wrapper">
      <div className="meta__wrapper__results" aria-live="assertive" tabIndex={0}>
        {length} results for &nbsp;<span className="query">{query}</span>
      </div>
    </div>
  );
};