import { SignUpBox } from '@components/sign-up';
import { StyledLogo, StyledLink, ContainerCentered } from '@components/shared';

const SignUp = () => (
  <>
    <ContainerCentered>
      <StyledLogo size={100} />
    </ContainerCentered>
    <SignUpBox />
    <ContainerCentered>
      Already have an account?
      <StyledLink href="/sign-in" color="primary">
        {' '}
        Sign in.
      </StyledLink>
    </ContainerCentered>
  </>
);

export default SignUp;
