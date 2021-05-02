import chalk from 'chalk';
import { Socket, Server } from 'socket.io';
import { translateText, getLanguages } from '../utils/cloud-translation';

const registerListeners = (io: Server, socket: Socket) => {
  io.of('/chats').use((socket, next) => {
    socket.join('global');
    socket.join(socket.handshake.query.room!);
    next();
  });

  socket.onAny((eventName) => {
    console.log(chalk.bold.yellow(`CHAT: received ${eventName}`));
  });
};

export default registerListeners;
