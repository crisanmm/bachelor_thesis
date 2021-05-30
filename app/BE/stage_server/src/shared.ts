/**
 * Example JWT:
 * {
 *
 *  aud: "sdpfrpukifetupagvhgh6vh5d"
 *
 *  auth_time: 1620499753
 *
 *  cognito:username: "4f5cd51e-770a-4123-97e8-55baeb910b3c"
 *
 *  email: "user_one@example.com"
 *
 *  email_verified: false
 *
 *  event_id: "47bf9852-7c35-4f3d-8b11-8fac212c0619"
 *
 *  exp: 1620503353
 *
 *  family_name: "one"
 *
 *  given_name: "user"
 *
 *  iat: 1620499753
 *
 *  iss: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_bzl57SX04"
 *
 *  sub: "4f5cd51e-770a-4123-97e8-55baeb910b3c"
 *
 *  token_use: "id"
 *
 * }
 */
type JWT = {
  'aud': string;
  'auth_time': number;
  'cognito:username': string;
  'email': string;
  'email_verified': boolean;
  'event_id': string;
  'exp': number;
  'family_name': string;
  'given_name': string;
  'iat': number;
  'iss': string;
  'sub': string;
  'token_use': string;
};

type Position = [number, number, number];

interface AttenderType {
  position: Position;
  picture: string;
  id: string;
  email: string;
  emailVerified: boolean;
  givenName: string;
  familyName: string;
  customFacebook?: string;
  customLinkedin?: string;
  customPhone?: string;
  customJob?: string;
  customLanguage?: string;
}

type UserInformationType = {
  id: string;
  name: string;
};

interface BaseMessage {
  userInformation: UserInformationType;
  type: 'text/plain' | 'image/jpeg'; // MIME type of messages
  data: string;
  time: number;
}

interface TextMessageType extends BaseMessage {
  // ISO-639-1 language code
  language: string;
}

interface MediaMessageType extends BaseMessage {
  // alternative text description of the media
  alt: string;
}

type MessageType = TextMessageType | MediaMessageType;

export type { JWT, Position, AttenderType, TextMessageType, MediaMessageType, MessageType };
