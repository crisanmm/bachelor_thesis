import Head from 'next/head';
import { ForgotPasswordBox } from '@components/forgot-password';
import { Header, StyledPageWrapper, StyledLink, StyledContainer } from '@components/shared';

const ForgotPassword = () => (
  <>
    <Head>
      <title>Think-In | Forgot Password</title>
    </Head>

    <Header />

    <StyledPageWrapper>
      <ForgotPasswordBox />
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

export default ForgotPassword;
