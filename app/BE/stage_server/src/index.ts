import { createServer } from 'http';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';
import chalk from 'chalk';
import { config } from 'dotenv';
import validateJWT from './utils/validateJWT';
config({ path: '../.env' });

const httpServer = createServer();
const options = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  maxHttpBufferSize: 1e6,
};
const io = new Server(httpServer, options);

io.on('connection', async (socket: Socket) => {
  const idToken = await validateJWT(socket.handshake.query.idToken as string);
  if (!idToken) socket.disconnect();
  console.log('🚀  -> file: index.ts  -> line 27  -> idToken', idToken);

  socket.on('disconnect', (reason) => {
    console.log('client disconnected');
    console.log(`reason: ${reason}`);
  });

  socket.on('position', ([x, z]) => {
    console.log('🚀  -> file: index.ts  -> line 30  -> x', x);
    console.log('🚀  -> file: index.ts  -> line 29  -> z', z);
  });
});

process.env.PORT = process.env.PORT || '3000';
httpServer.listen(process.env.PORT, () => {
  console.log(chalk.bold.green(`Listening on port ${process.env.PORT}`));
});
