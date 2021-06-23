import { Server } from 'socket.io';
import type { Position, AttenderType } from '../shared';

interface AttenderPositionChange {
  id: string;
  position: Position;
}

const registerListeners = (io: Server) => {
  io.of('/stages').use((socket, next) => {
    socket.join(socket.handshake.auth.stageId!);
    next();
  });

  io.of('/stages').on('connection', async (socket) => {
    socket.on('attender-join', async () => {
      // socket.attender = attender;
      console.log(`${socket.attender.email} has joined the ${socket.handshake.auth.stageId!} stage`);

      /**
       * Inform other attenders in this room that a new attender has joined.
       */
      socket.in(socket.handshake.auth.stageId!).emit('attender-join', socket.attender);

      /**
       * Inform the new attender of all the other attenders in this room.
       */
      Array.from((await socket.in(socket.handshake.auth.stageId!).allSockets()).values())
        .filter((socketId) => socketId !== socket.id)
        .map((socketId) => io.of('/stages').sockets.get(socketId)!)
        .forEach((otherSocket) => socket.emit('attender-join', otherSocket.attender));
    });

    socket.on('attender-position-change', (attenderPositionChange: AttenderPositionChange) => {
      socket.attender!.position = attenderPositionChange.position;
      socket.in(socket.handshake.auth.stageId!).emit('attender-position-change', attenderPositionChange);
    });

    socket.on('attender-leave', (attender: AttenderType) => {
      /**
       * Disconnection when user changes stage.
       */
      socket.in(socket.handshake.auth.stageId!).emit('attender-leave', attender);
      socket.disconnect();
    });

    socket.on('disconnect', (reason: string) => {
      console.log(`Client disconnected, reason: ${reason}`);
      if (socket.attender) socket.in(socket.handshake.auth.stageId!).emit('attender-leave', socket.attender);
    });
  });
};

export default registerListeners;
