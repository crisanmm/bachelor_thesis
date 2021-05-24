import React, { useContext, useEffect, useState } from 'react';
import { Container, Paper } from '@material-ui/core';
import {
  computeAttenderDisplayName,
  getAttributesFromSession,
  getUserLanguage,
  UserAttributes,
} from '#utils';
import { AccountContext, SocketContext } from '#contexts';
import type { MessageType, HeaderChatType } from './shared';
import ChatHeader from './chatHeader';
import ChatBody from './chatBody';
import ChatFooter from './chatFooter';
import { AttenderType } from '../stage/attenderManager/shared';

interface ChatsPrivateMessageEventType {
  emittedInputMessage: string; // the input message when the send button was pressed
  emittedTime: number; // the time when the send button was pressed
}

interface ChatsFileUploadEventType {
  event: React.ChangeEvent<HTMLInputElement>;
  emittedTime: number; // the time when the file was uploaded
}

interface PrivateMessageEventType {
  fromUser: AttenderType; // the uuid v4 id from the originator of the message
  message: MessageType; // the sent message
}

interface UserOnlineStateEventType {
  userId: string; // the uuid v4 id of the user which online state has changed
  state: boolean; // false if the user went offline, true otherwise
}

/**
 * Find the header chat in header chat array.
 * @param headerChats Header chat array.
 * @param id The id of the user
 * @returns The header chat if it is in the array, null otherwise.
 */
const getHeaderChatWithUserId = (headerChats: HeaderChatType[], userId: string) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const headerChat of headerChats) if (headerChat.user.id === userId) return headerChat;
  return null;
};

/**
 * Find out if a header chat is in the header chat array
 * @param headerChats Header chat array.
 * @param id The id of the user.
 * @returns True if the header chat is in the array, false otherwise.
 */
const isHeaderChatWithIdInHeaderChatArray = (headerChats: HeaderChatType[], userId: string) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const headerChat of headerChats) if (headerChat.user.id === userId) return true;
  return false;
};

const getSelectedHeaderChat = (headerChats: HeaderChatType[]) =>
  headerChats.filter((headerChat) => headerChat.selected)[0];

const ChatManager = () => {
  const { getSession } = useContext(AccountContext.Context);
  const socket = useContext(SocketContext.Context).chatSocket!;
  const { emitter } = useContext(SocketContext.Context);
  const [myUser, setMyUser] = useState<UserAttributes>(undefined as unknown as UserAttributes);
  const [headerChats, setHeaderChats] = useState<HeaderChatType[]>([
    {
      user: {
        id: 'global',
        givenName: 'Global',
        familyName: 'Chat',
        email: 'global@think-in.me',
        emailVerified: true,
        picture: 'https://think-in-content.s3.eu-central-1.amazonaws.com/avatars/global.jpg',
      },
      notifications: 0,
      selected: true,
      online: true,
    },
    {
      user: {
        id: 'stage',
        givenName: 'Stage',
        familyName: 'Chat',
        email: 'stage@think-in.me',
        emailVerified: true,
        picture: 'https://think-in-content.s3.eu-central-1.amazonaws.com/avatars/stage.jpg',
      },
      notifications: 0,
      selected: false,
      online: true,
    },
    // {
    //   user: {
    //     id: '4f5cd51e-770a-4123-97e8-55baeb910b3c',
    //     givenName: 'user',
    //     familyName: 'one',
    //     email: '',
    //     emailVerified: true,
    //     picture: 'https://think-in-content.s3.eu-central-1.amazonaws.com/avatars/stage.png',
    //   },
    //   notifications: 0,
    //   selected: false,
    //   online: false,
    // },
  ]);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      userInformation: {
        id: '4f5cd51e-770a-4123-97e8-55baeb910b3c',
        name: 'crisan mihai',
      },
      type: 'text/plain',
      data: 'this is a text message',
      language: 'en',
    },
    {
      userInformation: { id: 'notme', name: 'Not Me' },
      type: 'text/plain',
      data: 'this is a text message too',
      language: 'en',
    },
    {
      userInformation: {
        id: '4f5cd51e-770a-4123-97e8-55baeb910b3c',
        name: 'crisan mihai',
      },
      type: 'image/jpeg',
      data: 'https://think-in-content.s3.eu-central-1.amazonaws.com/avatars/avatar3.jpg',
      alt: "Ana's avatar picture",
    },
    {
      userInformation: {
        id: '4f5cd51e-770a-4123-97e8-55baeb910b3c',
        name: 'crisan mihai',
      },
      type: 'text/plain',
      data: 'this is a text messagethis is a text message this is a text message this is a text message this is a text message this is a text message',
      language: 'en',
    },
    {
      userInformation: {
        id: '4f5cd51e-770a-4123-97e8-55baeb910b3c',
        name: 'crisan mihai',
      },
      type: 'text/plain',
      data: 'this is a text messagethis is a text message this is a text message this is a text message this is a text message this is a text message',
      language: 'en',
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');

  useEffect(() => {
    if (myUser === undefined) {
      getSession().then((userSession) => {
        const userAttributes = getAttributesFromSession(userSession);
        setMyUser(userAttributes);
        // socket.emit('set-attender', userAttributes);
      });
    } else {
      emitter.on('chats:close-chat', (chatIndex: number) => {
        setHeaderChats((headerChats) => {
          const newHeaderChats = headerChats.filter((headerChat, index) => index !== chatIndex);

          /**
           * if the header chat that was deleted was the one selected,
           * then select the global chat
           */
          if (
            newHeaderChats
              .map((headerChat) => headerChat.selected)
              .every((selected) => selected === false)
          )
            newHeaderChats[0].selected = true;
          return newHeaderChats;
        });
        // TODO: show persisted  messages
        setMessages([]);
      });

      emitter.on('chats:opened-chat', (userAttributes: UserAttributes) => {
        setHeaderChats((headerChats) => {
          // TODO: show persisted messages
          setMessages([]);

          // if the chat is already opened just set it to selected
          if (isHeaderChatWithIdInHeaderChatArray(headerChats, userAttributes.id))
            return headerChats.map((headerChat) => {
              if (headerChat.user.id === userAttributes.id) {
                headerChat.selected = true;
                headerChat.notifications = 0;
              } else {
                headerChat.selected = false;
              }
              return headerChat;
            });

          // otherwise add it and set it to selected
          const headerChat = {
            user: userAttributes,
            notifications: 0,
            selected: true,
            online: true,
          };
          return [
            ...headerChats.map((headerChat) => ({ ...headerChat, selected: false })),
            headerChat,
          ];
        });
      });

      emitter.on('chats:change-chat', (chatIndex: number) => {
        // chatIndex is always a number
        setHeaderChats((headerChats) =>
          headerChats.map((headerChat, index) => {
            if (index === chatIndex) {
              headerChat.selected = true;
              headerChat.notifications = 0;
            } else {
              headerChat.selected = false;
            }
            return headerChat;
          }),
        );
        setMessages([]);
        // TODO: send message to websocket server, receive chat messages
      });

      emitter.on(
        'chats:private-message',
        ({ emittedInputMessage }: ChatsPrivateMessageEventType) => {
          // Add message locally
          const message = {
            userInformation: { id: myUser.id, name: computeAttenderDisplayName(myUser) },
            type: 'text/plain',
            data: emittedInputMessage,
            language: getUserLanguage(),
          };
          setMessages((messages) => [...messages, message as MessageType]);

          /**
           * Use setHeaderChats in order to get the latest headerChats and avoid headerChats closure
           */
          setHeaderChats((headerChats) => {
            // Send message to websocket server
            socket.emit('private-message', {
              toUser: getSelectedHeaderChat(headerChats).user,
              message,
            });
            return headerChats;
          });
        },
      );

      // event: React.ChangeEvent<HTMLInputElement>
      emitter.on('chats:file-upload', ({ event, emittedTime }: ChatsFileUploadEventType) => {
        const file = event.target.files![0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener('load', (event: any) => {
          // Add message locally
          setMessages((messages) => [
            ...messages,
            {
              userInformation: { id: myUser.id, name: computeAttenderDisplayName(myUser) },
              time: emittedTime,
              type: 'image/jpeg',
              data: event.target.result,
              language: getUserLanguage(),
            },
          ]);

          // TODO: Send message to websocket server

          event.target.value = null;
        });
      });

      socket.on('private-message', async ({ fromUser, message }: PrivateMessageEventType) => {
        /**
         * Use setHeaderChats in order to get the latest headerChats and avoid headerChats closure
         */
        console.log('🚀  -> file: ChatManager.tsx  -> line 294  -> fromUser', fromUser);
        setHeaderChats((headerChats) => {
          if (message.userInformation.id === getSelectedHeaderChat(headerChats).user.id) {
            // if the user has this chat opened and selected then simply change the messages
            setMessages((messages) => [...messages, message]);
            return headerChats;
          }

          if (isHeaderChatWithIdInHeaderChatArray(headerChats, fromUser.id)) {
            // if the user has this chat opened but not selected then add notification to it
            return headerChats.map((headerChat) => {
              if (headerChat.user.id === fromUser.id) {
                headerChat.notifications += 1;
              }
              return headerChat;
            });
          }

          // if the user doesn't have this chat opened then add it
          const headerChat = {
            user: fromUser,
            notifications: 1,
            selected: false,
            online: true,
          };
          return [...headerChats, headerChat];

          // setHeaderChats((headerChats) => {
          //   const fromUserHeaderChat = headerChats.filter(
          //     (headerChat) => headerChat.user.id === fromUser.id,
          //   )[0];
          //   fromUserHeaderChat.notifications += 1;
          //   return [...headerChats];
          // });
          // return headerChats;
        });
      });

      socket.on('file-upload', (response) => {
        if (!response.success) {
          setInputMessage('Failed uploading image.');
          return;
        }
        setInputMessage(`${response.imageLink} ${response.caption}`);
      });

      socket.on('connected-users', (connectedUserIds: string[]) => {
        setHeaderChats((headerChats) => {
          headerChats.forEach((headerChat) => {
            if (connectedUserIds.find((connectedUserId) => connectedUserId === headerChat.user.id))
              headerChat.online = true;
          });
          return [...headerChats];
        });
      });

      socket.on('user-state-change', ({ userId, state }: UserOnlineStateEventType) => {
        setHeaderChats((headerChats) => {
          headerChats.forEach((headerChat) => {
            if (headerChat.user.id === userId) headerChat.online = state;
          });
          return [...headerChats];
        });
      });
    }
  }, [myUser]);

  if (myUser === undefined) return <></>;

  return (
    <Container>
      <Paper elevation={1}>
        <ChatHeader emitter={emitter} headerChats={headerChats} />
        <ChatBody
          headerChat={getSelectedHeaderChat(headerChats)}
          messages={messages}
          myUser={myUser}
        />
        <ChatFooter
          emitter={emitter}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
        />
      </Paper>
    </Container>
  );
};

export { getSelectedHeaderChat };
export default ChatManager;
