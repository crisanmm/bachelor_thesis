import Head from 'next/head';
import { SignInBox } from '@components/sign-in';
import { Header, StyledPageWrapper, StyledLink, StyledContainer } from '@components/shared';

const SignIn = () => (
  <>
    <Head>
      <title>Think-In | Sign In</title>
    </Head>

    <Header />

    <StyledPageWrapper>
      <SignInBox />
      <StyledContainer>
        Don&apos;t have an account?&nbsp;
        <StyledLink href="/sign-up" color="primary">
          Sign up
        </StyledLink>
        .
      </StyledContainer>
    </StyledPageWrapper>
  </>
);

export default SignIn;
