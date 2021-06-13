import Head from 'next/head';
import { Header, StyledPageWrapper, RequireAuthentication } from '#components/shared';
import { PasswordBox } from '#components/profile';

const ProfileChangePassword = () => (
  <RequireAuthentication>
    <Head>
      <title>Think-In | Change Password</title>
    </Head>

    <Header />

    <StyledPageWrapper>
      <PasswordBox />
    </StyledPageWrapper>
  </RequireAuthentication>
);

export default ProfileChangePassword;
