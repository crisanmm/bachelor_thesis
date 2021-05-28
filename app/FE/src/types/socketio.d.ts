import 'socket.io-client';

declare module 'socket.io-client' {
  interface Socket {
    auth: {
      [key: string]: any;
    };
  }
}
