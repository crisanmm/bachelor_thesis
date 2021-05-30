import Head from 'next/head';
import { Stage, ChatManager } from '#components/index';
import { Header, StyledPageWrapper } from '#components/shared';
import { SocketContext } from '#contexts';

const Index = () => {
  const stageId = 'dev-room';

  return (
    <>
      <Head>
        <title>Think-In</title>
      </Head>

      <Header />

      <StyledPageWrapper>
        <SocketContext.Provider stageId={stageId}>
          <Stage />
          <ChatManager />
        </SocketContext.Provider>
      </StyledPageWrapper>
    </>
  );
};

export default Index;
