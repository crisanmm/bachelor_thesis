import socketio from 'socket.io';
import type { JWT } from '../shared';

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
