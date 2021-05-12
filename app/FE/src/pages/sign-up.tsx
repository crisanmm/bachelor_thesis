import Head from 'next/head';
import { useRouter } from 'next/router';
import { SignUpBox } from '@components/sign-up';
import { Header, StyledPageWrapper, StyledLink, StyledContainer } from '@components/shared';
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
};

export default SignUp;
