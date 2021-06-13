import Head from 'next/head';
import { Header, StyledPageWrapper, RequireAuthentication } from '#components/shared';
import { EmailBox } from '#components/profile';

const ProfileChangeEmail = () => (
  <RequireAuthentication>
    <Head>
      <title>Think-In | Change Email</title>
    </Head>

    <Header />

    <StyledPageWrapper>
      <EmailBox />
    </StyledPageWrapper>
  </RequireAuthentication>
);

export default ProfileChangeEmail;
