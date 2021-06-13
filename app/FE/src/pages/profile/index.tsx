import Head from 'next/head';
import React from 'react';
import { Header, StyledPageWrapper, RequireAuthentication } from '#components/shared';
import { MainAttributesBox } from '#components/profile';

const Profile = () => (
  <RequireAuthentication>
    <Head>
      <title>Think-In | Edit Profile</title>
    </Head>

    <Header />

    <StyledPageWrapper>
      <MainAttributesBox />
    </StyledPageWrapper>
  </RequireAuthentication>
);

export default Profile;
