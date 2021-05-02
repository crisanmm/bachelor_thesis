import { Socket, Server } from 'socket.io';

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

const registerListeners = (io: Server, socket: Socket) => {
  io.of('/stages').use((socket, next) => {
    socket.join(socket.handshake.query.room!);
    next();
  });

  socket.on('attender-join', async (attender: AttenderType) => {
    socket.attender = attender;
    console.log(`${socket.idToken.email} joined`);

    /**
     * Inform other attenders in this room that a new attender has joined.
     */
    socket.in(socket.handshake.query.room!).emit('attender-join', attender);

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
     * Disconnection initiated by the user.
     */
    socket.in(socket.handshake.query.room!).emit('attender-leave', attender);
    socket.disconnect();
  });

  socket.on('disconnect', (reason: string) => {
    /**
     * Disconnection because of lost connection.
     */
    console.log(`Client disconnected, reason: ${reason}`);
    if (socket.attender)
      socket.in(socket.handshake.query.room!).emit('attender-leave', socket.attender);
  });
};

export default registerListeners;
