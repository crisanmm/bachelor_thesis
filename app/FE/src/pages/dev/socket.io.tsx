/* eslint-disable */
import { useRef, useEffect, useContext } from 'react';
import { Button } from '@material-ui/core';
import { io, Socket } from 'socket.io-client';
import { Account } from '@contexts';

const setupSocketIoEvents = (socket: Socket) => {
  socket.on('connect', () => {
    console.log('socket connected');
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected');
  });
};

const Page = () => {
  const socket = useRef<Socket>();
  const { getSession } = useContext(Account.Context);
  useEffect(() => {
    getSession().then((userSession) => {
      console.log('🚀  -> file: socket.io.tsx  -> line 22  -> userSession', userSession);
      socket.current = io('ws://localhost:4000', {
        query: { idToken: userSession.getIdToken().getJwtToken() },
      });
      setupSocketIoEvents(socket.current);
    });
  }, []);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          // socket.current?.emit('position', [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]);
          socket.current?.emit('ehlo', { a: 5 });
        }}
      >
        send position
      </Button>
    </>
  );
};

export default Page;
