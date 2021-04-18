import socketio from 'socket.io';

type JWT = {
  [key: string]: any;
};

type Position = [number, number, number];

export interface ExtendedSocket extends socketio.Socket {
  attender?: {
    position: Position;
    givenName: string;
    familyName: string;
    id: string;
  };
  idToken?: JWT;
}
