import * as path from 'path';
import os from 'os';
import { resolve4 } from 'dns';
import { createServer } from 'http';
import chalk from 'chalk';
import { config } from 'dotenv';
import { createSocketIOServer } from './socketio/index';

config({ path: `${path.resolve(__dirname, '..')}/.env` });

const httpServer = createServer();

createSocketIOServer(httpServer);

process.env.WEBSOCKET_SERVER_PORT = process.env.WEBSOCKET_SERVER_PORT || '3000';

// compute hostname by DNS A type record query
resolve4(os.hostname(), (err, address) => {
  httpServer.listen({ host: address[0], port: process.env.WEBSOCKET_SERVER_PORT }, () => {
    // eslint-disable-next-line no-console
    console.log(chalk.bold.green(`Listening on ${address}:${process.env.WEBSOCKET_SERVER_PORT}`));
  });
});
