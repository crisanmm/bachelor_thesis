import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Account } from '@contexts';
import mitt, { Emitter } from 'mitt';

const WEBSOCKET_ADDRESS = 'ws://3.122.54.160:3000';

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
  socket: Socket;
  emitter: Emitter;
}

const Context = createContext<StageContext>({} as StageContext);

const Provider: React.FunctionComponent = ({ children }) => {
  const { getSession } = useContext(Account.Context);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    getSession().then((userSession) => {
      const socket = io(WEBSOCKET_ADDRESS, {
        auth: { idToken: userSession.getIdToken().getJwtToken() },
      });
      setupSocketEvents(socket);
      setSocket(socket);
    });
  }, []);

  //   if (!socket) return <>{children}</>;
  return <Context.Provider value={{ socket: socket!, emitter }}>{children}</Context.Provider>;
};

export default { Context, Provider };
