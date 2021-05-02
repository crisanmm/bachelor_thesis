import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AccountContext } from '@contexts';
import mitt, { Emitter } from 'mitt';
import { StyledContainer } from '@components/shared';
import { ErrorOutline } from '@material-ui/icons';
import { Typography } from '@material-ui/core';

// const WEBSOCKET_ADDRESS = 'ws://3.122.54.160:3000';
const WEBSOCKET_ADDRESS = 'ws://localhost:4000';

const setupSocketEvents = (socket: Socket) => {
  socket.on('connect', () => {
    console.log('🚀  -> file: Socket.tsx  -> line 9  -> socket connected', 'socket connected');
  });

  socket.on('disconnect', () => {
    console.log(
      '🚀  -> file: Socket.tsx  -> line 13  -> socket disconnected',
      'socket disconnected',
    );
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

const Provider: React.FunctionComponent = ({ children }) => {
  const { getSession } = useContext(AccountContext.Context);
  const [stageSocket, setStageSocket] = useState<Socket | null>();
  const [chatSocket, setChatSocket] = useState<Socket | null>();

  useEffect(() => {
    getSession()
      .then((userSession) => {
        const socketOptions = {
          auth: { idToken: userSession.getIdToken().getJwtToken() },
          query: { room: 'dev-room' },
        };

        const stageSocket = io(`${WEBSOCKET_ADDRESS}/stages`, socketOptions);
        setupSocketEvents(stageSocket);
        setStageSocket(stageSocket);

        const chatSocket = io(`${WEBSOCKET_ADDRESS}/chats`, socketOptions);
        setupSocketEvents(chatSocket);
        setChatSocket(chatSocket);
      })
      .catch((e) => {
        console.log('🚀  -> file: StageContext.tsx  -> line 48  -> e', e);
        setStageSocket(null);
        setChatSocket(null);
      });
  }, []);

  if (stageSocket === undefined || chatSocket === undefined)
    return <StyledContainer>Connecting to websocket server...</StyledContainer>;

  if (stageSocket === null || chatSocket === null)
    return (
      <StyledContainer>
        <ErrorOutline style={{ fontSize: '2.5rem' }} />
        <Typography>Error connecting to websocket server, are you authenticated?</Typography>
      </StyledContainer>
    );

  return (
    <Context.Provider value={{ stageSocket, chatSocket, emitter }}>{children}</Context.Provider>
  );
};

export default { Context, Provider };
