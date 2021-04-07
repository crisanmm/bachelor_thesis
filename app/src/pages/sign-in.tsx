import { SignInBox } from '@components/sign-in';
import { StyledLogo, StyledLink, StyledContainer } from '@components/shared';

const SignIn = () => (
  <>
    <StyledContainer>
      <StyledLogo size={100} />
    </StyledContainer>
    <SignInBox />
    <StyledContainer>
      Don&apos;t have an account?{' '}
      <StyledLink href="/sign-up" color="primary">
        Sign up.
      </StyledLink>
    </StyledContainer>
  </>
);

export default SignIn;
