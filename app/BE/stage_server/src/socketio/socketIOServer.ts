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

interface CreateSocketIOServer {
  (httpServer: HttpServer): SocketIOServer;
}

const registerGeneralMiddleware = (io: SocketIOServer) => {
  ['/stages', '/chats'].forEach((namespace) => {
    io.of(namespace).use(async (socket, next) => {
      try {
        const idTokenDecoded = await validateJWT(socket.handshake.auth.idToken as string);
        socket.idToken = socket.handshake.auth.idToken;
        socket.idTokenDecoded = idTokenDecoded;
        socket.attender = JSON.parse(socket.handshake.query.attender as string);
        next();
      } catch (e) {
        console.log(e);
        next(new Error('Not authenticated.'));
      }
    });
  });
};

const createSocketIOServer: CreateSocketIOServer = (httpServer) => {
  const io = new SocketIOServer(httpServer, socketIOOptions);

  /**
   * Register middleware for every namespace.
   */
  registerGeneralMiddleware(io);

  /**
   * Register event listeners for stage actions.
   */
  registerStageListeners(io);

  /**
   * Register event listeners for chat actions.
   */
  registerChatListeners(io);

  return io;
};

export default createSocketIOServer;
