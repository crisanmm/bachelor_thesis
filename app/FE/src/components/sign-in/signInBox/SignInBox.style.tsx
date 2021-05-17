import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import GoogleLogo from '#public/icons/google-logo.svg';

const StyledGoogleLoginButton = styled((props) => (
  <Button startIcon={<GoogleLogo />} variant="outlined" size="large" color="default" {...props} />
))`
  margin-top: ${({ theme }) => theme.spacing(2)}px;
  ${({ theme }) => theme.breakpoints.up(375)} {
    max-width: 280px;
  }
`;

const StyledSeparator = styled.div`
  border: 1px solid ${({ theme }) => theme.palette.divider};
  width: 100%;
  margin: 0 ${({ theme }) => theme.spacing(1)}px;
`;

const StyledSocialLoginSeparator = styled((props) => (
  <div {...props}>
    <StyledSeparator />
    <Typography variant="overline">or</Typography>
    <StyledSeparator />
  </div>
))`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing(2)}px;
`;

export { StyledGoogleLoginButton, StyledSocialLoginSeparator };
