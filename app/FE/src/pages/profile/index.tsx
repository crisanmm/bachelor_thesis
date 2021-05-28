import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header, StyledPageWrapper } from '#components/shared';
import { MainAttributesBox } from '#components/profile';
import { useUser } from '#hooks';

const Profile = () => {
  const router = useRouter();
  const { isLoggedIn, isLoggingIn } = useUser();

  if (!isLoggedIn) {
    // if user is not logged in, redirect to index page
    if (!isLoggingIn) router.push('/');
    return <></>;
  }

  return (
    <>
      <Head>
        <title>Think-In | Edit Profile</title>
      </Head>

      <Header />

      <StyledPageWrapper>
        <MainAttributesBox />
      </StyledPageWrapper>
    </>
  );
};

export default Profile;
