import * as path from 'path';
import { createServer } from 'http';
import chalk from 'chalk';
import { config } from 'dotenv';
import { createSocketIOServer } from './socketio/index';

config({ path: `${path.resolve(__dirname, '..')}/.env` });

const httpServer = createServer();

createSocketIOServer(httpServer);

process.env.WEBSOCKET_SERVER_PORT = process.env.WEBSOCKET_SERVER_PORT || '3000';
httpServer.listen(process.env.WEBSOCKET_SERVER_PORT, () => {
  console.log(chalk.bold.green(`Listening on port ${process.env.WEBSOCKET_SERVER_PORT}`));
});
