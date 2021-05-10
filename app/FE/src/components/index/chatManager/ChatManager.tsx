import { AccountContext, SocketContext } from '@contexts';
import React, { useContext, useEffect, useState } from 'react';
import { Container, Paper } from '@material-ui/core';
import { getUserLanguage } from '@utils';
import type { MessageType, HeaderChatType, UserInformationType } from './shared';
import ChatHeader from './chatHeader';
import ChatBody from './chatBody';
import ChatFooter from './chatFooter';

interface ChatsPrivateMessageEventType {
  emittedInputMessage: string; // the input message when the send button was pressed
  emittedTime: number; // the time when the send button was pressed
}

interface ChatsFileUploadEventType {
  event: React.ChangeEvent<HTMLInputElement>;
  emittedTime: number; // the time when the file was uploaded
}

interface PrivateMessageEventType {
  fromUserId: string; // the uuid v4 id from the originator of the message
  message: MessageType; // the sent message
}

interface UserOnlineStateEventType {
  userId: string; // the uuid v4 id of the user which online state has changed
  state: boolean; // false if the user went offline, true otherwise
}

const getSelectedHeaderChat = (headerChats: HeaderChatType[]) =>
  headerChats.filter((headerChat) => headerChat.selected)[0];

const ChatManager = () => {
  const { getSession } = useContext(AccountContext.Context);
  const socket = useContext(SocketContext.Context).chatSocket!;
  const { emitter } = useContext(SocketContext.Context);
  const [userInformation, setUserInformation] = useState<UserInformationType>(
    (undefined as unknown) as UserInformationType,
  );
  const [headerChats, setHeaderChats] = useState<HeaderChatType[]>([
    {
      user: { id: 'global', name: 'Global', email: '' },
      notifications: 0,
      selected: true,
      online: true,
    },
    {
      user: { id: 'stage', name: 'Stage', email: '' },
      notifications: 0,
      selected: false,
      online: true,
    },
    {
      user: { id: 'drake', name: 'Drake', email: '' },
      notifications: 0,
      selected: false,
      online: false,
    },
    {
      user: { id: '4f5cd51e-770a-4123-97e8-55baeb910b3c', name: 'user one name', email: '' },
      notifications: 0,
      selected: false,
      online: false,
    },
    {
      user: { id: 'd3a1d2c1-03e3-452c-bf40-00eb5bf639e3', name: 'user two name', email: '' },
      notifications: 0,
      selected: false,
      online: false,
    },
  ]);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      user: {
        id: '4f5cd51e-770a-4123-97e8-55baeb910b3c',
        name: 'crisan mihai',
        email: '',
      },
      time: 1619901459879,
      type: 'text/plain',
      data: 'this is a text message',
      language: 'en',
    },
    {
      user: { id: 'notme', name: 'Not Me', email: '' },
      time: 1619901459879,
      type: 'text/plain',
      data: 'this is a text message too',
      language: 'en',
    },
    {
      user: {
        id: '4f5cd51e-770a-4123-97e8-55baeb910b3c',
        name: 'crisan mihai',
        email: '',
      },
      time: 1619901459879,
      type: 'image/jpeg',
      data: 'https://think-in-content.s3.eu-central-1.amazonaws.com/avatars/avatar3.jpg',
      alt: "Ana's avatar picture",
    },
    {
      user: {
        id: '4f5cd51e-770a-4123-97e8-55baeb910b3c',
        name: 'crisan mihai',
        email: '',
      },
      time: 1619901459879,
      type: 'text/plain',
      data:
        'this is a text messagethis is a text message this is a text message this is a text message this is a text message this is a text message',
      language: 'en',
    },
    {
      user: {
        id: '4f5cd51e-770a-4123-97e8-55baeb910b3c',
        name: 'crisan mihai',
        email: '',
      },
      time: 1619982112537,
      type: 'text/plain',
      data:
        'this is a text messagethis is a text message this is a text message this is a text message this is a text message this is a text message',
      language: 'en',
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');

  useEffect(() => {
    if (userInformation === undefined) {
      getSession().then((userSession) => {
        setUserInformation({
          id: userSession.getIdToken().payload.sub,
          name: `${userSession.getIdToken().payload.given_name} ${
            userSession.getIdToken().payload.family_name
          }`,
          email: userSession.getIdToken().payload.email,
        });
      });
    } else {
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
        ({ emittedInputMessage, emittedTime }: ChatsPrivateMessageEventType) => {
          // Add message locally
          const message = {
            user: userInformation,
            time: emittedTime,
            type: 'text/plain',
            data: emittedInputMessage,
            language: getUserLanguage(),
          };
          setMessages((messages) => [...messages, message as MessageType]);

          // Send message to websocket server
          socket.emit('private-message', {
            toUserId: getSelectedHeaderChat(headerChats).user.id,
            message,
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
              user: userInformation,
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

      socket.on('private-message', async ({ fromUserId, message }: PrivateMessageEventType) => {
        console.log('🚀  -> file: ChatManager.tsx  -> line 173  -> fromUserId', fromUserId);
        if (message.user.id === getSelectedHeaderChat(headerChats).user.id) {
          setMessages((messages) => [...messages, message]);
        } else {
          setHeaderChats((headerChats) => {
            const fromUserHeaderChat = headerChats.filter(
              (headerChat) => headerChat.user.id === fromUserId,
            )[0];
            fromUserHeaderChat.notifications += 1;
            return [...headerChats];
          });
        }
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
  }, [userInformation]);

  if (userInformation === undefined) return <></>;

  return (
    <Container>
      <Paper elevation={1}>
        <ChatHeader emitter={emitter} headerChats={headerChats} />
        <ChatBody
          headerChat={getSelectedHeaderChat(headerChats)}
          messages={messages}
          userInformation={userInformation}
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

export default ChatManager;
export { getSelectedHeaderChat };
