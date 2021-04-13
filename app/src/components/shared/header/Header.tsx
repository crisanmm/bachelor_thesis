import { Divider } from '@material-ui/core';
import Link from 'next/link';
import { StyledLogo } from '@components/shared';
import { StyledAppBar, StyledToolbar, StyledFiller, StyledSignInButton } from './Header.style';

const Header = () => (
  <StyledAppBar position="sticky" color="primary">
    <StyledToolbar>
      <StyledLogo />
      <StyledFiller />
      <Link href="/sign-in">
        <StyledSignInButton color="inherit">Sign In</StyledSignInButton>
      </Link>
    </StyledToolbar>
    <Divider />
  </StyledAppBar>
);

export default Header;
