import Head from 'next/head';
import { Header, StyledPageWrapper, RequireAdmin, RequireAuthentication } from '#components/shared';
import { EditStageBox } from '#components/stages';

const EditStage = () => (
  <RequireAuthentication>
    <RequireAdmin>
      <Head>
        <title>Think-In | Edit Stage</title>
      </Head>

      <Header />

      <StyledPageWrapper>
        <EditStageBox />
      </StyledPageWrapper>
    </RequireAdmin>
  </RequireAuthentication>
);

export default EditStage;
