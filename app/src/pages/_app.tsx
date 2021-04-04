import type { AppProps, NextWebVitalsMetric } from 'next/app';
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
} from 'styled-components';
import React, { useState } from 'react';
import {
  createMuiTheme,
  ThemeProvider as MaterialUIThemeProvider,
  StylesProvider,
} from '@material-ui/core/styles';
import { lightTheme, darkTheme } from '@utils/theme';
import palette from '@utils/theme/palette';
import { FormControlLabel, NoSsr, Switch, Paper, CssBaseline } from '@material-ui/core';

const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'Mulish';
        src: url('/fonts/Mulish-VariableFont.woff');
    }

    @font-face {
        font-family: 'Poppins';
        src: url('/fonts/Poppins-Regular.woff');
    }

    * {
        box-sizing: border-box;        
        font-family: Mulish;
    }

    body {
        margin: 0;
        padding: 0;
    }
`;

const StyledPaper = styled(Paper)`
  height: 100vh;
  width: 100vw;
`;

function MyApp({ Component, pageProps }: AppProps) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  palette.type = isDarkTheme ? 'dark' : 'light';
  const muiTheme = createMuiTheme({ palette });

  return (
    <>
      <GlobalStyle />
      <StylesProvider injectFirst>
        <MaterialUIThemeProvider theme={muiTheme}>
          <StyledComponentsThemeProvider theme={muiTheme}>
            <NoSsr>
              <CssBaseline />
              <StyledPaper square>
                <FormControlLabel
                  control={
                    <Switch
                      color="primary"
                      checked={isDarkTheme}
                      onChange={() => setIsDarkTheme(!isDarkTheme)}
                    />
                  }
                  label="dark mode"
                  style={{ position: 'fixed', bottom: '0px', right: '0px', zIndex: 99 }}
                />
                <Component {...pageProps} />
              </StyledPaper>
            </NoSsr>
          </StyledComponentsThemeProvider>
        </MaterialUIThemeProvider>
      </StylesProvider>
    </>
  );
}

function reportWebVitals(metric: NextWebVitalsMetric) {
  //   console.log(metric);
}

export { reportWebVitals };
export default MyApp;
