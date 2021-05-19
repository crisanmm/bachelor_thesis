import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header, StyledPageWrapper } from '#components/shared';
import { PasswordBox } from '#components/profile';
import { useUser } from '#hooks';

const ProfileChangePassword = () => {
  const router = useRouter();
  const { isSignedInWithAThirdParty } = useUser();

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
        <title>Think-In | Change Password</title>
      </Head>

      <Header />

      <StyledPageWrapper>
        <PasswordBox />
      </StyledPageWrapper>
    </>
  );
};

export default ProfileChangePassword;
