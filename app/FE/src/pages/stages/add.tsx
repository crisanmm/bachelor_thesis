import Head from 'next/head';
import { Header, StyledPageWrapper, RequireAdmin, RequireAuthentication } from '#components/shared';
import { AddStageBox } from '#components/stages';

const AddStage = () => (
  <RequireAuthentication>
    <RequireAdmin>
      <Head>
        <title>Think-In | Edit Stage</title>
      </Head>

      <Header />

      <StyledPageWrapper>
        <AddStageBox />
      </StyledPageWrapper>
    </RequireAdmin>
  </RequireAuthentication>
);

export default AddStage;
