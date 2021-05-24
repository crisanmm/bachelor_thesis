import type { UserAttributes } from '#utils';

/**
 * Example user object:
 *
 * {
 *
 *  id: "4f5cd51e-770a-4123-97e8-55baeb910b3c"
 *
 *  name: "Crisan Mihai"
 *
 * }
 */
type UserInformationType = {
  id: string;
  name: string;
};

interface BaseMessage {
  userInformation: UserInformationType;
  type: 'text/plain' | 'image/jpeg'; // MIME type of messages
  data: string;
}

interface TextMessageType extends BaseMessage {
  // ISO-639-1 language code
  language: string;
}

interface MediaMessageType extends BaseMessage {
  // alternative text description of the media
  alt: string;
}

/**
 * Example messages:
 *
 * {
 *
 *  userInformation: {
 *
 *       id: "4f5cd51e-770a-4123-97e8-55baeb910b3c",
 *
 *       name: "crisan mihai",
 *
 *     },
 *
 *  type: "text/plain",
 *
 *  data: "this is a text message",
 *
 *  language: "en", // ISO-639-1 language code
 *
 * }
 *
 * {
 *
 *  userInformation: {
 *
 *       id: "4f5cd51e-770a-4123-97e8-55baeb910b3c",
 *
 *       name: "crisan mihai",
 *
 *     },
 *
 *  type: "image/jpeg",
 *
 *  data: "https://think-in-content.s3.eu-central-1.amazonaws.com/avatars/avatar3.jpg",
 *
 *  alt: "Ana's avatar picture"
 *
 * }
 */
type MessageType = TextMessageType | MediaMessageType;

interface HeaderChatType {
  user: UserAttributes;
  notifications: number;
  online: boolean;
  selected: boolean;
}

export type { UserInformationType, TextMessageType, MediaMessageType, MessageType, HeaderChatType };
