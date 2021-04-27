/// <reference path="types/socketio.d.ts" />
import type { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import validateJWT from './utils/validateJWT';

const socketIOOptions = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  maxHttpBufferSize: 1e6,
};

type Position = [number, number, number];

interface AttenderPositionChange {
  id: string;
  position: Position;
}

interface AttenderType {
  position: Position;
  givenName: string;
  familyName: string;
  id: string;
}

interface CreateSocketIOServer {
  (httpServer: HttpServer): SocketIOServer;
}

const createSocketIOServer: CreateSocketIOServer = (httpServer) => {
  const io = new SocketIOServer(httpServer, socketIOOptions);

  io.use(async (socket, next) => {
    try {
      const idToken = await validateJWT(socket.handshake.auth.idToken as string);
      socket.idToken = idToken;
      next();
    } catch (e) {
      console.log(e);
      next(new Error('Not authenticated.'));
    }
  });

  io.use((socket, next) => {
    socket.join('dev-room');
    next();
  });

  io.on('connection', async (socket) => {
    socket.onAny((eventName) => {
      //   console.log(
      //     '🚀  -> file: index.ts  -> line 41  -> eventName',
      //     eventName,
      //     socket.id,
      //     socket.idToken,
      //   );
    });

    socket.on('disconnect', (reason: string) => {
      console.log(`client disconnected, reason: ${reason}`);
      if (socket.attender) socket.in('dev-room').emit('attender-leave', socket.attender);
    });

    socket.on('attender-join', async (attender: AttenderType) => {
      socket.attender = attender;
      console.log(`${socket.idToken!.email} joined`);

      /**
       * Inform other attenders in this room that a new attender has joined.
       */
      socket.in('dev-room').emit('attender-join', attender);

      /**
       * Inform the new attender of all the other attenders in this room.
       */
      Array.from((await socket.in('dev-room').allSockets()).values())
        .filter((socketId) => socketId !== socket.id)
        .map((socketId) => io.of('/').sockets.get(socketId)!)
        .forEach((otherSocket) => socket.emit('attender-join', otherSocket.attender));
    });

    socket.on('attender-leave', (attender: AttenderType) => {
      socket.in('dev-room').emit('attender-leave', attender);
      socket.disconnect();
    });

    socket.on('attender-position-change', (attenderPositionChange: AttenderPositionChange) => {
      socket.attender!.position = attenderPositionChange.position;
      socket.in('dev-room').emit('attender-position-change', attenderPositionChange);
    });
  });

  return io;
};

export default createSocketIOServer;
