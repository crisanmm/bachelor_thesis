import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header, StyledPageWrapper } from '#components/shared';
import { EmailBox } from '#components/profile';
import { useUser } from '#hooks';

const ProfileChangeEmail = () => {
  const router = useRouter();
  const { isLoggedIn, isLoggingIn, isSignedInWithAThirdParty } = useUser();

  if (!isLoggedIn) {
    // if user is not logged in, redirect to index page
    if (!isLoggingIn) router.push('/');
    return <></>;
  }

  // isSignedInWithAThirdParty is undefined if it's still loading
  if (isSignedInWithAThirdParty === undefined) return <></>;

  // if user is signed in with a third party redirect to profile page
  if (isSignedInWithAThirdParty) {
    router.push('/profile');
    return <></>;
  }

  return (
    <>
      <Head>
        <title>Think-In | Change Email</title>
      </Head>

      <Header />

      <StyledPageWrapper>
        <EmailBox />
      </StyledPageWrapper>
    </>
  );
};

export default ProfileChangeEmail;
