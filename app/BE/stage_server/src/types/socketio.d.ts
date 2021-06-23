import type { JWT, AttenderType } from '../shared';

type Position = [number, number, number];

declare module 'socket.io' {
  interface Socket {
    attender: AttenderType;
    positon: Position;
    idToken: string;
    idTokenDecoded: JWT;
  }
}
