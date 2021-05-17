import Head from 'next/head';
import { useRouter } from 'next/router';
import { Typography, Box } from '@material-ui/core';
import { SignUpBox } from '#components/sign-up';
import { Header, StyledPageWrapper, StyledLink } from '#components/shared';
import { useUser } from '#hooks';

const SignUp = () => {
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
        <SignUpBox />
        <Box m={2}>
          <Typography variant="body1" color="textPrimary" align="center">
            Already have an account?&nbsp;
            <StyledLink href="/sign-in" color="primary">
              Sign in
            </StyledLink>
            .
          </Typography>
        </Box>
      </StyledPageWrapper>
    </>
  );
};

export default SignUp;
