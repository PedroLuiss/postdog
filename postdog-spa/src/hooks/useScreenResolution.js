import { useState, useEffect } from 'react';

const useScreenResolution = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMovil = width >= 0 && width < 390;
  const is390 = width >= 390 && width < 769;
  const is768 = width >= 769 && width < 1024;
  const is1024 = width >= 1024 && width < 1440;
  const is1440 = width >= 1440 && width < 1920;
  const is1920 = width >= 1920;

  return {
    is390,
    is768,
    is1024,
    is1440,
    is1920,
    isMovil,
    currentWidth: width
  };
};

export default useScreenResolution;