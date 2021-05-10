import Head from 'next/head';
import { SignUpBox } from '@components/sign-up';
import { Header, StyledPageWrapper, StyledLink, StyledContainer } from '@components/shared';

const SignUp = () => (
  <>
    <Head>
      <title>Think-In | Sign In</title>
    </Head>

    <Header />

    <StyledPageWrapper>
      <SignUpBox />
      <StyledContainer>
        Already have an account?&nbsp;
        <StyledLink href="/sign-in" color="primary">
          Sign in
        </StyledLink>
        .
      </StyledContainer>
    </StyledPageWrapper>
  </>
);

export default SignUp;
