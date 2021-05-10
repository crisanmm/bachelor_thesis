import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { IconButton, Tooltip } from '@material-ui/core';
import { Brightness4, Brightness7 } from '@material-ui/icons';
import { StyledLogo } from '@components/shared';
import { AccountContext, DarkThemeContext } from '@contexts';
import {
  StyledAppBar,
  StyledToolbar,
  StyledFiller,
  StyledSignInButton,
  StyledDivider,
} from './Header.style';

const Header = () => {
  const { getSession, signOut } = useContext(AccountContext.Context);
  const [isDarkTheme, toggleTheme] = useContext(DarkThemeContext.Context);
  const [AuthButton, setAuthButton] = useState<React.FunctionComponent>(() => () => (
    <Link href="/sign-in">
      <StyledSignInButton color="inherit">Sign In</StyledSignInButton>
    </Link>
  ));

  useEffect(() => {
    getSession()
      .then(() => {
        setAuthButton(() => () => (
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
      .catch(() => {
        // setAuthButton(
        //   <Link href="/sign-in">
        //     <StyledSignInButton color="inherit">Sign In</StyledSignInButton>
        //   </Link>,
        // );
      });
  }, []);

  return (
    <StyledAppBar position="sticky" color="primary">
      <StyledToolbar>
        <StyledLogo />
        <StyledFiller />
        <AuthButton />
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
