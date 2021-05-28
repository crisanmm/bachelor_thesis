import { useState } from 'react';

interface useDarkModeTuple extends Array<any> {
  0: boolean;
  1: () => void;
}

interface useDarkModeType {
  (): useDarkModeTuple;
}

const useDarkMode: useDarkModeType = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    // Make sure this is only run on browser
    if (typeof window !== 'undefined') return localStorage.getItem('isDarkTheme') === 'true' ? true : false;
    return false;
  });

  const toggleTheme = () => {
    setIsDarkTheme((isDarkTheme) => {
      // Make sure this is only run on browser
      if (typeof window !== 'undefined') localStorage.setItem('isDarkTheme', (!isDarkTheme).toString());
      return !isDarkTheme;
    });
  };

  return [isDarkTheme, toggleTheme];
};

export default useDarkMode;
