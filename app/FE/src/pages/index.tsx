import Head from 'next/head';
import { Stage, ChatManager } from '@components/index';
import { SocketContext } from '@contexts';
import { Header, StyledPageWrapper } from '@components/shared';

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
