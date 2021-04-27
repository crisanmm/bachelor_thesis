import React, { useContext, useEffect, useState } from 'react';
import { Divider } from '@material-ui/core';
import Link from 'next/link';
import { StyledLogo } from '@components/shared';
import { Account } from '@contexts';
import { StyledAppBar, StyledToolbar, StyledFiller, StyledSignInButton } from './Header.style';

const Header = () => {
  const { getSession, signOut } = useContext(Account.Context);
  const [AuthButton, setAuthButton] = useState<React.ReactElement>();

  useEffect(() => {
    getSession()
      .then(() => {
        setAuthButton(
          <StyledSignInButton
            color="inherit"
            onClick={() => {
              signOut();
              window.location.pathname = '/';
            }}
          >
            Sign Out
          </StyledSignInButton>,
        );
      })
      .catch(() => {
        setAuthButton(
          <Link href="/sign-in">
            <StyledSignInButton color="inherit">Sign In</StyledSignInButton>
          </Link>,
        );
      });
  }, []);

  return (
    <StyledAppBar position="sticky" color="primary">
      <StyledToolbar>
        <StyledLogo />
        <StyledFiller />
        {AuthButton ? AuthButton : undefined}
      </StyledToolbar>
      <Divider />
    </StyledAppBar>
  );
};

export default Header;
