import Head from 'next/head';
import { useRouter } from 'next/router';
import { Typography, Box } from '@material-ui/core';
import { SignInBox } from '#components/sign-in';
import { Header, StyledPageWrapper, StyledLink, StyledContainer } from '#components/shared';
import { useUser } from '#hooks';

const SignIn = () => {
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
        <title>Think-In | Sign In</title>
      </Head>

      <Header />

      <StyledPageWrapper>
        <SignInBox />
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

export default SignIn;
