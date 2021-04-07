import { SignUpBox } from '@components/sign-up';
import { StyledLogo, StyledLink, StyledContainer } from '@components/shared';

const SignUp = () => (
  <>
    <StyledContainer>
      <StyledLogo size={100} />
    </StyledContainer>
    <SignUpBox />
    <StyledContainer>
      Already have an account?{' '}
      <StyledLink href="/sign-in" color="primary">
        Sign in.
      </StyledLink>
    </StyledContainer>
  </>
);

export default SignUp;
