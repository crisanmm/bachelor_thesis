import { useState } from 'react';

interface UseDarkModeTuple extends Array<any> {
  0: boolean;
  1: () => void;
}

interface useDarkModeType {
  (): UseDarkModeTuple;
}

const useDarkMode: useDarkModeType = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isDarkTheme') === 'true' ? true : false;
    }
    return false;
  });

  const toggleTheme = () => {
    setIsDarkTheme((isDarkTheme) => {
      if (typeof window !== 'undefined')
        localStorage.setItem('isDarkTheme', (!isDarkTheme).toString());
      return !isDarkTheme;
    });
  };

  return [isDarkTheme, toggleTheme];
};

export default useDarkMode;
