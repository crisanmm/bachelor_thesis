import type { AppProps, NextWebVitalsMetric } from 'next/app';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
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

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [isDarkTheme, toggleTheme] = useDarkMode();
  const muiTheme = createMuiTheme((isDarkTheme ? darkTheme : lightTheme) as ThemeOptions);

  return (
    <MuiNoSsr>
      <MuiStylesProvider injectFirst>
        <MuiThemeProvider theme={muiTheme}>
          <MuiCssBaseline />
          <StyledComponentsThemeProvider theme={muiTheme}>
            <DarkThemeContext.Provider value={[isDarkTheme, toggleTheme]}>
              <AccountContext.Provider>
                <SessionErrorHandler>
                  <Component {...pageProps} />
                </SessionErrorHandler>
              </AccountContext.Provider>
            </DarkThemeContext.Provider>
          </StyledComponentsThemeProvider>
        </MuiThemeProvider>
      </MuiStylesProvider>
    </MuiNoSsr>
  );
};

const validRoutesWhenSessionIsNotOk = ['/sign-in', '/sign-up', '/forgot-password'];

const SessionErrorHandler: React.FunctionComponent = ({ children }) => {
  // const router = useRouter();
  const { getSession } = useContext(AccountContext.Context);
  // const [isSessionOk, setIsSessionOk] = useState<boolean>(false);

  useEffect(() => {
    getSession()
      .then((session) => {
        console.log(session);
        // setIsSessionOk(true);
      })
      .catch((e) => {
        console.error(e);
        // eslint-disable-next-line no-restricted-syntax
        for (const key in localStorage)
          if (key.startsWith('CognitoIdentityServiceProvider')) localStorage.removeItem(key);
        // if (!validRoutesWhenSessionIsNotOk.includes(router.route)) router.push('/sign-in');
      });
  }, []);

  // if (!isSessionOk && !validRoutesWhenSessionIsNotOk.includes(router.route)) return <></>;

  return <>{children}</>;
};

function reportWebVitals(metric: NextWebVitalsMetric) {
  //   console.log(metric);
}

export default MyApp;
export { reportWebVitals };
