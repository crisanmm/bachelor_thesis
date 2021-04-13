import { ForgotPasswordBox } from '@components/forgot-password';
import { StyledLink, StyledContainer } from '@components/shared';

const SignIn = () => (
  <>
    <ForgotPasswordBox />
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
