import type { UserAttributes } from '#utils';

type UserInformationType = {
  id: string;
  name: string;
  picture: string;
};

interface BaseMessage {
  userInformation: UserInformationType;
  type: string; // MIME type of messages
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

interface HeaderChatType {
  user: Omit<UserAttributes, 'token'>;
  notifications: number;
  online: boolean;
  selected: boolean;
}

export type { UserInformationType, TextMessageType, MediaMessageType, MessageType, HeaderChatType };
