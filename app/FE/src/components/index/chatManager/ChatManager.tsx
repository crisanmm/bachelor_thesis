import { AccountContext, SocketContext } from '@contexts';
import { useContext, useEffect, useState } from 'react';
import { Box, Container, Paper } from '@material-ui/core';
import type { Message } from './shared';
import ChatHeader from './chatHeader';
import ChatBody from './chatBody';
import ChatFooter from './chatFooter';

const ChatManager = () => {
  const { getSession } = useContext(AccountContext.Context);
  const socket = useContext(SocketContext.Context).chatSocket!;
  const { emitter } = useContext(SocketContext.Context);
  const [myId, SetMyId] = useState<string>();
  const [headerChats, setHeaderChats] = useState<string[]>([
    'global',
    'stage',
    'user1',
    'user2',
    'user3',
    'user4',
    'user5',
    'user6',
    'user7',
  ]);
  const [messages, setMessages] = useState<Message[]>([
    {
      user: '4f5cd51e-770a-4123-97e8-55baeb910b3c',
      time: 1619901459879,
      type: 'text',
      data: 'this is a text message',
      language: 'en',
    },
    {
      user: 'notMe',
      time: 1619901459879,
      type: 'text',
      data: 'this is a text message too',
      language: 'en',
    },
    {
      user: '4f5cd51e-770a-4123-97e8-55baeb910b3c',
      time: 1619901459879,
      type: 'media',
      data: 'https://think-in-content.s3.eu-central-1.amazonaws.com/avatars/avatar3.jpg',
      alt: "Ana's avatar picture",
    },
    {
      user: '4f5cd51e-770a-4123-97e8-55baeb910b3c',
      time: 1619901459879,
      type: 'text',
      data:
        'this is a text messagethis is a text message this is a text message this is a text message this is a text message this is a text message',
      language: 'en',
    },
    {
      user: '4f5cd51e-770a-4123-97e8-55baeb910b3c',
      time: 1619982112537,
      type: 'text',
      data:
        'this is a text messagethis is a text message this is a text message this is a text message this is a text message this is a text message',
      language: 'en',
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');

  useEffect(() => {
    emitter.on('chats:private-message', (emittedInputMessage) => {
      // TODO: send message to websocket server
    });

    emitter.on('chats:file-upload', () => {
      // TODO: send message to websocket server
    });

    socket.on('private-message', async (message: Message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on('file-upload', (response) => {
      if (!response.success) {
        setInputMessage('Failed uploading image.');
        return;
      }
      setInputMessage(`${response.imageLink} ${response.caption}`);
    });

    getSession().then((userSession) => {
      const id = userSession.getIdToken().payload.sub;
      SetMyId(id);
    });
  }, []);

  if (myId === undefined) return <></>;
  // console.log(myId);
  // console.log(messages[0]);
  // console.log(messages[0].user === myId);

  return (
    <Container>
      <Paper elevation={1}>
        <ChatHeader headerChats={headerChats} />
        <ChatBody messages={messages} myId={myId} />
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
