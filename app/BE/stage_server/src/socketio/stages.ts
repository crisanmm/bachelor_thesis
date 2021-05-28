import { Socket, Server } from 'socket.io';
import type { Position, AttenderType } from '../shared';

interface AttenderPositionChange {
  id: string;
  position: Position;
}

const registerListeners = (io: Server) => {
  io.of('/stages').use((socket, next) => {
    socket.join(socket.handshake.query.room!);
    next();
  });

  io.of('/stages').on('connection', async (socket) => {
    socket.on('attender-join', async () => {
      // socket.attender = attender;
      console.log(`${socket.idTokenDecoded.email} has joined the stage`);

      /**
       * Inform other attenders in this room that a new attender has joined.
       */
      socket.in(socket.handshake.query.room!).emit('attender-join', socket.attender);

      /**
       * Inform the new attender of all the other attenders in this room.
       */
      Array.from((await socket.in(socket.handshake.query.room!).allSockets()).values())
        .filter((socketId) => socketId !== socket.id)
        .map((socketId) => io.of('/stages').sockets.get(socketId)!)
        .forEach((otherSocket) => socket.emit('attender-join', otherSocket.attender));
    });

    socket.on('attender-position-change', (attenderPositionChange: AttenderPositionChange) => {
      socket.attender!.position = attenderPositionChange.position;
      socket
        .in(socket.handshake.query.room!)
        .emit('attender-position-change', attenderPositionChange);
    });

    socket.on('attender-leave', (attender: AttenderType) => {
      /**
       * Disconnection when user changes stage.
       */
      socket.in(socket.handshake.query.room!).emit('attender-leave', attender);
      socket.disconnect();
    });

    socket.on('disconnect', (reason: string) => {
      console.log(`Client disconnected, reason: ${reason}`);
      if (socket.attender)
        socket.in(socket.handshake.query.room!).emit('attender-leave', socket.attender);
    });
  });
};

export default registerListeners;
