import { ForgotPasswordBox } from '@components/forgot-password';
import { StyledLogo, StyledLink, ContainerCentered } from '@components/shared';

const SignIn = () => (
  <>
    <ContainerCentered>
      <StyledLogo size={100} />
    </ContainerCentered>
    <ForgotPasswordBox />
    <ContainerCentered>
      Don&apos;t have an account?{' '}
      <StyledLink href="/sign-up" color="primary">
        Sign up.
      </StyledLink>
    </ContainerCentered>
  </>
);

export default SignIn;
