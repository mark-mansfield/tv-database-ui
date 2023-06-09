import React, { useState, useEffect } from 'react';
import '../../style.scss';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

export const Summary: React.FC<{ summary: string }> = ({ summary }) => {
  const MAX_TEXT = 360;
  const [usedSummary, setUsedSummary] = useState('');
  const [showFullSummary, setShowFullSummary] = useState(true);
  const [showToggle, setShowToggle] = useState(false);

  function toggleShowMore(event: any) {
    if (event.key === 'Enter') {
      event.preventDefault();
      setShowFullSummary(!showFullSummary);
    }

    setShowFullSummary(!showFullSummary);
  }

  function handleSetUsedSummary() {
    if (!showFullSummary) {
      setUsedSummary(getReducedSummary());
    }
    if (showFullSummary) {
      setUsedSummary(summary);
    }
  }

  function getReducedSummary() {
    return summary.substring(0, MAX_TEXT);
  }

  useEffect(() => {
    handleSetUsedSummary();
  }, [showFullSummary]);

  useEffect(() => {
    if (!summary) return;

    const isLargeText = summary.length > MAX_TEXT;
    if (!isLargeText) {
      setUsedSummary(summary);
      return;
    }

    setShowToggle(isLargeText);
    setUsedSummary(getReducedSummary());
    setShowFullSummary(false);
  }, [summary]);

  const text = parse(DOMPurify.sanitize(usedSummary));

  return (
    <>
      <p tabIndex={0}>{text}</p>
      {showToggle ? (
        <>
          <button
            onClick={(e) => toggleShowMore(e)}
            className="button lowercase"
            aria-label={!showFullSummary ?'hear full summary' : 'hear less summary'}
            tabIndex={0}>
            {showFullSummary ? 'less' : 'more'}
          </button>
        </>
      ) : null}
    </>
  );
};
