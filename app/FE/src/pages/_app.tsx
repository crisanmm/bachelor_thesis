import type { AppProps, NextWebVitalsMetric } from 'next/app';
import { useRouter } from 'next/router';
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
} from 'styled-components';
import React, { useState } from 'react';
import {
  createMuiTheme,
  MuiThemeProvider,
  StylesProvider as MuiStylesProvider,
  ThemeOptions,
} from '@material-ui/core/styles';
import { theme } from '@utils';
import {
  FormControlLabel,
  NoSsr as MuiNoSsr,
  Switch,
  Paper,
  CssBaseline as MuiCssBaseline,
  PaletteType,
} from '@material-ui/core';
import type { Palette } from '@material-ui/core/styles/createPalette';
import { AccountContext, DarkThemeContext } from '@contexts';
import { useDarkMode } from '#hooks';

// const GlobalStyle = createGlobalStyle`
//     @font-face {
//         font-family: 'Mulish';
//         src: url('/fonts/Mulish-VariableFont.woff');
//     }

//     @font-face {
//         font-family: 'Poppins';
//         src: url('/fonts/Poppins-Regular.woff');
//     }

//     * {
//         box-sizing: border-box;
//         font-family: Mulish;
//     }

//     body {
//         margin: 0;
//         padding: 0;
//     }
// `;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // console.log('🚀  -> file: _app.tsx  -> line 50  -> router', router);

  const [isDarkTheme, toggleTheme] = useDarkMode();
  theme.palette.type = isDarkTheme ? 'dark' : 'light';
  const muiTheme = createMuiTheme(theme as ThemeOptions);
  // console.log(muiTheme);

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

export { reportWebVitals };
export default MyApp;
