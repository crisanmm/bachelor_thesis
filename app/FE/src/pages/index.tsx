import Head from 'next/head';
import { StageList, Stage, ChatManager } from '#components/index';
import { Header, StyledPageWrapper } from '#components/shared';
import { SocketContext } from '#contexts';
import { useStageId, useUser } from '#hooks';

const Index = () => {
  const [stageId, setStageId] = useStageId();
  const { isLoggedIn } = useUser();
  console.log('🚀  -> file: index.tsx  -> line 10  -> isLoggedIn', isLoggedIn);

  return (
    <>
      <Head>
        <title>Think-In</title>
      </Head>

      <Header />

      <StyledPageWrapper>
        {isLoggedIn && <StageList setStageId={setStageId} />}
        <SocketContext.Provider stageId={stageId} setStageId={setStageId}>
          <Stage />
          <ChatManager />
        </SocketContext.Provider>
      </StyledPageWrapper>
    </>
  );
};

export default Index;
