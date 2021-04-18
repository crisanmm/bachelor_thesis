import { createServer } from 'http';
import chalk from 'chalk';
import { config } from 'dotenv';
import createSocketIOServer from './SocketIOServer';

config({ path: '.env' });

const httpServer = createServer();

createSocketIOServer(httpServer);

process.env.PORT = process.env.PORT || '3000';
httpServer.listen(process.env.PORT, () => {
  console.log(chalk.bold.green(`Listening on port ${process.env.PORT}`));
});
