import { Stage, ChatManager } from '@components/index';
import { SocketContext } from '@contexts';

const Index = () => (
  <SocketContext.Provider>
    <Stage />
    <ChatManager />
  </SocketContext.Provider>
);

export default Index;
