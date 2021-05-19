import Head from 'next/head';
import { Header, StyledPageWrapper } from '#components/shared';
import { MainAttributesBox } from '#components/profile';

const Profile = () => (
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

export default Profile;
