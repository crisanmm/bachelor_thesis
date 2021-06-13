import type { AppProps, NextWebVitalsMetric } from 'next/app';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import React from 'react';
import {
  createMuiTheme,
  MuiThemeProvider,
  StylesProvider as MuiStylesProvider,
  ThemeOptions,
} from '@material-ui/core/styles';
import { NoSsr as MuiNoSsr, CssBaseline as MuiCssBaseline } from '@material-ui/core';
import { lightTheme, darkTheme } from '#utils';
import { AccountContext, DarkThemeContext } from '#contexts';
import { useDarkMode } from '#hooks';

function MyApp({ Component, pageProps }: AppProps) {
  const [isDarkTheme, toggleTheme] = useDarkMode();
  const muiTheme = createMuiTheme((isDarkTheme ? darkTheme : lightTheme) as ThemeOptions);

  return (
    <MuiNoSsr>
      <MuiStylesProvider injectFirst>
        <MuiThemeProvider theme={muiTheme}>
          <MuiCssBaseline />
          <StyledComponentsThemeProvider theme={muiTheme}>
            <AccountContext.Provider>
              <DarkThemeContext.Provider value={[isDarkTheme, toggleTheme]}>
                <Component {...pageProps} />
              </DarkThemeContext.Provider>
            </AccountContext.Provider>
          </StyledComponentsThemeProvider>
        </MuiThemeProvider>
      </MuiStylesProvider>
    </MuiNoSsr>
  );
}

function reportWebVitals(metric: NextWebVitalsMetric) {
  //   console.log(metric);
}

export default MyApp;
export { reportWebVitals };
