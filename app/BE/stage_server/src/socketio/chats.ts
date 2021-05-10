import chalk from 'chalk';
import { Server } from 'socket.io';
import { getLanguages, translateText } from '../utils/cloud-translation';

const registerListeners = (io: Server) => {
  const userIdToSocketIdMap = new Map<string, string>();

  io.of('/chats').use((socket, next) => {
    socket.join('global');
    socket.join(socket.handshake.query.stage!);
    userIdToSocketIdMap.set(socket.idToken.sub, socket.id);
    next();
  });

  io.of('/chats').on('connection', async (socket) => {
    console.log('Has joined the chat:');
    console.log(`      ${socket.idToken.given_name} ${socket.idToken.family_name}`);
    console.log(`      ${socket.idToken.sub}`);
    console.log(`      ${socket.id}`);

    /**
     * Notify the user that has just connected of the other connected users.
     */
    socket.emit('connected-users', Array.from(userIdToSocketIdMap.keys()));

    /**
     * Notify all the other users of the user that has just connected.
     */
    io.of('/chats')
      .except(socket.id)
      .emit('user-state-change', { userId: socket.idToken.sub, state: true });

    socket.onAny((eventName) => {
      console.log(chalk.bold.yellow(`CHAT: received event ${eventName}`));
    });

    socket.on('private-message', ({ toUserId, message }) => {
      if (userIdToSocketIdMap.has(toUserId)) {
        socket
          .to(userIdToSocketIdMap.get(toUserId) as string)
          .emit('private-message', { fromUserId: socket.idToken.sub, message });
      }
    });

    socket.on('disconnect', () => {
      io.of('/chats')
        .except(socket.id)
        .emit('user-state-change', { userId: socket.idToken.sub, state: false });
      userIdToSocketIdMap.delete(socket.idToken.sub);
    });
  });
};

export default registerListeners;
