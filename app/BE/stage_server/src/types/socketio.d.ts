import socketio from 'socket.io';

type JWT = {
  [key: string]: any;
};

type Position = [number, number, number];

declare module 'socket.io' {
  interface Socket {
    attender: {
      position: Position;
      givenName: string;
      familyName: string;
      id: string;
    };
    idToken: JWT;
  }
}
