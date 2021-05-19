import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { IconButton, Tooltip } from '@material-ui/core';
import { AccountCircle, Brightness4, Brightness7 } from '@material-ui/icons';
import { StyledLogo } from '#components/shared';
import { AccountContext, DarkThemeContext } from '#contexts';
import {
  StyledAppBar,
  StyledToolbar,
  StyledFiller,
  StyledSignInButton,
  StyledDivider,
} from './Header.style';
import { useUser } from '#hooks';

const Header = () => {
  const { getSession, signOut } = useContext(AccountContext.Context);
  const [isDarkTheme, toggleTheme] = useContext(DarkThemeContext.Context);
  const { isLoggedIn, isLoggingIn } = useUser();
  const [AuthenticationButton, setAuthenticationButton] = useState<React.FunctionComponent>(
    () => () =>
      (
        <Link href="/sign-in">
          <StyledSignInButton color="inherit">Sign In</StyledSignInButton>
        </Link>
      ),
  );

  useEffect(() => {
    getSession()
      .then(() => {
        setAuthenticationButton(() => () => (
          <StyledSignInButton
            color="inherit"
            onClick={() => {
              signOut();
              window.location.pathname = '/';
            }}
          >
            Sign Out
          </StyledSignInButton>
        ));
      })
      .catch(() => {});
  }, []);

  if (isLoggingIn) return <></>;

  return (
    <StyledAppBar position="sticky" color="primary">
      <StyledToolbar>
        <StyledLogo />
        <StyledFiller />
        <AuthenticationButton />
        {isLoggedIn ? (
          <Link href="/profile">
            <Tooltip title="Go to profile page" arrow>
              <IconButton>
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Link>
        ) : undefined}
        <Tooltip title="Toggle light/dark theme" arrow>
          <IconButton onClick={() => toggleTheme()}>
            {isDarkTheme ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>
      </StyledToolbar>
      <StyledDivider />
    </StyledAppBar>
  );
};

export default Header;
