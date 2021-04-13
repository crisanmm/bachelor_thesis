import { SignUpBox } from '@components/sign-up';
import { StyledLink, StyledContainer } from '@components/shared';

const SignUp = () => (
  <>
    <SignUpBox />
    <StyledContainer>
      Already have an account?&nbsp;
      <StyledLink href="/sign-in" color="primary">
        Sign in
      </StyledLink>
      .
    </StyledContainer>
  </>
);

export default SignUp;
