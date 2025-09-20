'use client';

import { useState, useEffect } from 'react';

const ScrollProgress = () => {
  const [width, setWidth] = useState(0);

  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    const scrollPercentage = (scrollPosition / totalHeight) * 100;
    setWidth(scrollPercentage);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-1 bg-transparent">
      <div
        className="h-full bg-primary transition-all duration-75 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default ScrollProgress;
