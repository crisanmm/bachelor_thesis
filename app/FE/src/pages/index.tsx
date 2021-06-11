import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { StageList, Stage, ChatManager } from '#components/index';
import { Header, StyledPageWrapper, StyledCircularProgress } from '#components/shared';
import { AccountContext, SocketContext } from '#contexts';
import { useStage, useUser } from '#hooks';
import { ENDPOINTS } from '#utils';
import type { Stage as StageType } from '#types/stage';

const Index = () => {
  const [stages, setStages] = useState<StageType[]>();
  const [stage, setStage] = useStage();
  const { isLoggedIn } = useUser();
  const { getSession } = useContext(AccountContext.Context);

  useEffect(() => {
    const fetchStages = async () => {
      const response = await axios.get(ENDPOINTS.STAGES, {
        headers: { Authorization: `Bearer ${(await getSession()).getIdToken().getJwtToken()}` },
      });

      setStages(response.data.data.items);
    };

    fetchStages();
  }, []);

  return (
    <>
      <Head>
        <title>Think-In</title>
      </Head>

      <Header />

      <StyledPageWrapper>
        {isLoggedIn && stages ? <StageList stages={stages} setStage={setStage} /> : <StyledCircularProgress />}
        <SocketContext.Provider stageId={stage?.title}>
          <Stage stage={stage!} />
          <ChatManager />
        </SocketContext.Provider>
      </StyledPageWrapper>
    </>
  );
};

export default Index;
