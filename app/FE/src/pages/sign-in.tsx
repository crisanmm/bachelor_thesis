import { SignInBox } from '@components/sign-in';
import { StyledLink, StyledContainer } from '@components/shared';

const SignIn = () => (
  <>
    <SignInBox />
    <StyledContainer>
      Don&apos;t have an account?&nbsp;
      <StyledLink href="/sign-up" color="primary">
        Sign up
      </StyledLink>
      .
    </StyledContainer>
  </>
);

export default SignIn;
