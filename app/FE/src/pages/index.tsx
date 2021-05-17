import Head from 'next/head';
import { Stage, ChatManager } from '#components/index';
import { Header, StyledPageWrapper } from '#components/shared';
import { SocketContext } from '#contexts';

const Index = () => (
  <>
    <Head>
      <title>Think-In</title>
    </Head>

    <Header />

    <StyledPageWrapper>
      <SocketContext.Provider>
        <Stage />
        <ChatManager />
      </SocketContext.Provider>
    </StyledPageWrapper>
  </>
);

export default Index;
