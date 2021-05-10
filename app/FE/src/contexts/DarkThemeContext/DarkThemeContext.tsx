import React, { createContext } from 'react';
import { useDarkMode } from '#hooks';

let value;
if (typeof window !== 'undefined')
  value = localStorage.getItem('isDarkTheme') === 'true' ? true : false;

interface DarkThemeContextProps {
  value: ReturnType<typeof useDarkMode>;
}

const Context = createContext([value, () => {}] as DarkThemeContextProps['value']);

const Provider: React.FunctionComponent<DarkThemeContextProps> = ({ children, value }) => (
  <Context.Provider value={value}>{children}</Context.Provider>
);

export default { Context, Provider };
