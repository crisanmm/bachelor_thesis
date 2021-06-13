import Head from 'next/head';
import { Header, RequireAdmin, RequireAuthentication, StyledPageWrapper } from '#components/shared';
import { MenuBox } from '#components/stages';

const Stages = () => (
  <RequireAuthentication>
    <RequireAdmin>
      <Head>
        <title>Think-In | Edit Stages</title>
      </Head>

      <Header />

      <StyledPageWrapper>
        <MenuBox />
      </StyledPageWrapper>
    </RequireAdmin>
  </RequireAuthentication>
);

export default Stages;
