import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { io, Socket } from 'socket.io-client';
import mitt, { Emitter } from 'mitt';
import { Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { AccountContext } from '#contexts';
import { StyledContainer } from '#components/shared';
import { StageList } from '#components/index';
import { getAttributesFromSession } from '#utils';

// const WEBSOCKET_ADDRESS = 'ws://3.122.54.160:3000';
const WEBSOCKET_ADDRESS =
  process.env.NODE_ENV === 'development' ? 'ws://192.168.0.103:4000' : 'ws://35.158.139.213:4000';

const setupSocketEvents = (socket: Socket) => {
  socket.on('connect', () => {
    console.log('🚀  -> file: Socket.tsx  -> line 9  -> socket connected', 'socket connected');
  });

  socket.on('disconnect', () => {
    console.log('🚀  -> file: Socket.tsx  -> line 13  -> socket disconnected', 'socket disconnected');
  });

  socket.on('connect_error', (err) => {
    console.log('🚀  -> file: StageContext.tsx  -> line 19  -> err', err);
  });
};

const emitter = mitt();

interface StageContext {
  // in case of error connecting, the value of socket is null
  chatSocket?: Socket | null;
  stageSocket?: Socket | null;
  emitter: Emitter;
}

const Context = createContext<StageContext>({} as StageContext);

interface SocketContextProviderProps {
  stageId: string | null;
  setStageId: (stageId: string) => void;
}

const Provider: React.FunctionComponent<SocketContextProviderProps> = ({ children, stageId, setStageId }) => {
  const { getSession } = useContext(AccountContext.Context);
  const [stageSocket, setStageSocket] = useState<Socket | null>();
  const [chatSocket, setChatSocket] = useState<Socket | null>();
  const [error, setError] = useState<string | null>('Connecting to websocket server...');
  const router = useRouter();

  useEffect(() => {
    getSession()
      .then((userSession) => {
        if (stageId === null) {
          setError('Currently not connected to any stage, connect to one from the above selections.');
        } else {
          const socketOptions = {
            auth: { idToken: userSession.getIdToken().getJwtToken(), stageId },
            query: {
              attender: JSON.stringify({
                position: [0, 0, 0],
                ...getAttributesFromSession(userSession),
              }),
            },
          };

          const stageSocket = io(`${WEBSOCKET_ADDRESS}/stages`, socketOptions);
          setupSocketEvents(stageSocket);
          setStageSocket(stageSocket);

          const chatSocket = io(`${WEBSOCKET_ADDRESS}/chats`, socketOptions);
          setupSocketEvents(chatSocket);
          setChatSocket(chatSocket);

          // when user changes from index page, disconnect sockets
          router.events.on('routeChangeStart', () => {
            stageSocket.disconnect();
            chatSocket.disconnect();
          });

          setError(null);
        }
      })
      .catch((e) => {
        console.log('🚀  -> file: StageContext.tsx  -> line 48  -> e', e);
        setError('Error connecting to websocket server, are you authenticated?');
        setStageSocket(null);
        setChatSocket(null);
      });
  }, []);

  // <ErrorOutline style={{ fontSize: '2.5rem' }} />
  if (error)
    return (
      <>
        {/* {error === 'Currently not connected to any stage, connect to one from the above selections.' && (
          <StageList setStageId={setStageId} />
        )} */}
        <Box maxWidth="350px" marginX="auto">
          <Alert severity="info">{error}</Alert>
        </Box>
      </>
    );

  // if (stageId === null)
  //   return (
  //     <StyledContainer>Currently not connected to any stage, connect to one from the above cards.</StyledContainer>
  //   );

  // if (stageSocket === undefined || chatSocket === undefined)
  //   return <StyledContainer>Connecting to websocket server...</StyledContainer>;

  // if (stageSocket === null || chatSocket === null)
  //   return (
  //     <StyledContainer>
  //       <ErrorOutline style={{ fontSize: '2.5rem' }} />
  //       <Typography>Error connecting to websocket server, are you authenticated?</Typography>
  //     </StyledContainer>
  //   );

  return <Context.Provider value={{ stageSocket, chatSocket, emitter }}>{children}</Context.Provider>;
};

export default { Context, Provider };
