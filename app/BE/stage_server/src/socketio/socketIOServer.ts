/// <reference path="../types/socketio.d.ts" />
import type { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import validateJWT from '../utils/validateJWT';
import registerStageListeners from './stages';
import registerChatListeners from './chats';

const socketIOOptions = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  maxHttpBufferSize: 1e6,
};

// type Position = [number, number, number];

// interface AttenderPositionChange {
//   id: string;
//   position: Position;
// }

// interface AttenderType {
//   position: Position;
//   givenName: string;
//   familyName: string;
//   id: string;
// }

interface CreateSocketIOServer {
  (httpServer: HttpServer): SocketIOServer;
}

const createSocketIOServer: CreateSocketIOServer = (httpServer) => {
  const io = new SocketIOServer(httpServer, socketIOOptions);

  // TODO: refactor the code duplication from below
  io.of('/stages').use(async (socket, next) => {
    try {
      const idToken = await validateJWT(socket.handshake.auth.idToken as string);
      socket.idToken = idToken;
      next();
    } catch (e) {
      console.log(e);
      next(new Error('Not authenticated.'));
    }
  });

  io.of('/chats').use(async (socket, next) => {
    try {
      const idToken = await validateJWT(socket.handshake.auth.idToken as string);
      socket.idToken = idToken;
      next();
    } catch (e) {
      console.log(e);
      next(new Error('Not authenticated.'));
    }
  });

  io.of('/stages').on('connection', async (socket) => {
    /**
     * Register event listeners for stage actions.
     */
    registerStageListeners(io, socket);
  });

  io.of('/chats').on('connection', async (socket) => {
    /**
     * Register event listeners for chat actions.
     */
    console.log(`${socket.idToken.sub} has joined the chat`);
    registerChatListeners(io, socket);
  });

  return io;
};

export default createSocketIOServer;
