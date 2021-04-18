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
  StylesProvider,
} from '@material-ui/core/styles';
import { theme } from '@utils';
import { FormControlLabel, NoSsr, Switch, Paper, CssBaseline } from '@material-ui/core';
import type { Palette } from '@material-ui/core/styles/createPalette';
import { Account } from '@contexts';
import { Header, StyledPageWrapper } from '@components/shared';

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
  z-index: -1;
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.palette.background.default};
`;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  console.log('🚀  -> file: _app.tsx  -> line 50  -> router', router);
  const isDev = router.route.startsWith('/dev');

  const [isDarkTheme, setIsDarkTheme] = useState(false);
  theme.palette.type = isDarkTheme ? 'dark' : 'light';
  const muiTheme = createMuiTheme(theme);

  return (
    <NoSsr>
      <CssBaseline />
      <StylesProvider injectFirst>
        <MuiThemeProvider theme={muiTheme}>
          <StyledComponentsThemeProvider theme={muiTheme}>
            <Account.Provider>
              <StyledPaper square>
                {isDev ? undefined : <Header />}
                <StyledPageWrapper>
                  <Component {...pageProps} />
                </StyledPageWrapper>
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
              </StyledPaper>
            </Account.Provider>
          </StyledComponentsThemeProvider>
        </MuiThemeProvider>
      </StylesProvider>
    </NoSsr>
  );
}

function reportWebVitals(metric: NextWebVitalsMetric) {
  //   console.log(metric);
}

export { reportWebVitals };
export default MyApp;
