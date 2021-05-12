import Head from 'next/head';
import { useRouter } from 'next/router';
import { ForgotPasswordBox } from '@components/forgot-password';
import { Header, StyledPageWrapper, StyledLink, StyledContainer } from '@components/shared';
import { useUser } from '#hooks';

const ForgotPassword = () => {
  const router = useRouter();
  const { isLoggedIn, isLoggingIn } = useUser();

  // loading
  if (isLoggingIn) return <></>;

  if (isLoggedIn) {
    router.push('/');
    return <></>;
  }

  return (
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
};

export default ForgotPassword;
