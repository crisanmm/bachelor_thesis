import Head from 'next/head';
import { useRouter } from 'next/router';
import { Typography, Box } from '@material-ui/core';
import { ForgotPasswordBox } from '#components/forgot-password';
import { Header, StyledPageWrapper, StyledLink } from '#components/shared';
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
        <Box m={2}>
          <Typography variant="body1" color="textPrimary" align="center">
            Don&apos;t have an account?&nbsp;
            <StyledLink href="/sign-up" color="primary">
              Sign up
            </StyledLink>
            .
          </Typography>
        </Box>
      </StyledPageWrapper>
    </>
  );
};

export default ForgotPassword;
