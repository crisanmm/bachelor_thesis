/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
import React, { useContext } from 'react';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { Socket } from 'socket.io-client';
import { Emitter } from 'mitt';
import axios from 'axios';
import { Container, Paper } from '@material-ui/core';
import {
  computeAttenderDisplayName,
  getAttributesFromSession,
  getUserLanguage,
  UserAttributes,
  getPersistedHeaderChats,
  setPersistedHeaderChats,
} from '#utils';
import { AccountContext, SocketContext } from '#contexts';
import type { MessageType, HeaderChatType, MediaMessageType } from './shared';
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
}

interface PrivateMessageEventType {
  fromUser: AttenderType;
  message: MessageType; // the sent message
}

interface LastEvaluatedKey {
  lastEvaluatedPK: string;
  lastEvaluatedSK: string;
}

interface NotificationsEventType {
  usersInformation: UserAttributes[];
}

interface ChatMessagesEventType {
  withUser: UserAttributes;
  data: {
    lastEvaluatedPK: string;
    lastEvaluatedSK: string;
    items: MessageType[];
  };
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

interface ChatManagerComponentProps {
  getSession: () => Promise<CognitoUserSession>;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  emitter: Emitter;
}

interface ChatManagerComponentState {
  myUser: UserAttributes | undefined;
  headerChats: HeaderChatType[];
  messages: MessageType[];
  lastEvaluatedKey: LastEvaluatedKey | undefined;
  inputMessage: string;
  inputFileEvent: React.ChangeEvent<HTMLInputElement> | undefined;
  areMessagesInInitialLoad: boolean | undefined;
  shouldScrollMessages: boolean | undefined;
}

class ChatManagerComponent extends React.Component<ChatManagerComponentProps, ChatManagerComponentState> {
  stageId: string;

  constructor(props: ChatManagerComponentProps) {
    super(props);
    this.stageId = (this.props.socket.auth as { [key: string]: any }).stageId;
    console.log('persisted chats', [...getPersistedHeaderChats(this.stageId)]);
    this.state = {
      myUser: undefined,
      headerChats: getPersistedHeaderChats(this.stageId),
      messages: [],
      lastEvaluatedKey: undefined,
      inputMessage: '',
      inputFileEvent: undefined,
      areMessagesInInitialLoad: undefined,
      shouldScrollMessages: undefined,
    };
  }

  onChatsCloseChat = (chatIndex: number) => {
    // emitted when "Close chat" button is pressed
    // @ts-ignore
    this.setState(({ headerChats }) => {
      const newHeaderChats = headerChats.filter((headerChat, index) => index !== chatIndex);
      /**
       * if the header chat that was deleted was the one selected,
       * then select the global chat
       */
      if (newHeaderChats.map((headerChat) => headerChat.selected).every((selected) => selected === false))
        newHeaderChats[0] = { ...newHeaderChats[0], selected: true };

      // reset last evaluated key
      return { headerChats: newHeaderChats, lastEvaluatedKey: undefined };
    });
  };

  onChatsOpenedChat = (userAttributes: UserAttributes) => {
    // emitted when chat was opened from attender dialog popup
    // @ts-ignore
    this.setState(({ headerChats }) => {
      // if the chat is already opened just set it to selected
      if (isHeaderChatWithIdInHeaderChatArray(headerChats, userAttributes.id))
        return {
          headerChats: headerChats.map((headerChat) => {
            if (headerChat.user.id === userAttributes.id) return { ...headerChat, selected: true, notifications: 0 };
            return { ...headerChat, selected: false };
          }),
        };

      // otherwise add it and set it to selected
      const headerChat = {
        user: userAttributes,
        notifications: 0,
        selected: true,
        online: false,
      };
      return {
        headerChats: [...headerChats.map((headerChat) => ({ ...headerChat, selected: false })), headerChat],
      };
    });

    // reset last evaluated key
    this.setState({ lastEvaluatedKey: undefined });
  };

  onChatsChangeChat = (chatIndex: number) => {
    // chatIndex is always a number

    // select newest chat
    // and reset last evaluated key
    // @ts-ignore
    this.setState((previousState) => {
      const _headerChats = previousState.headerChats.map((headerChat, index) => {
        if (index === chatIndex) return { ...headerChat, selected: true, notifications: 0 };
        return { ...headerChat, selected: false };
      });

      return {
        headerChats: _headerChats,
        lastEvaluatedKey: undefined,
      };
    });
  };

  onChatsPrivateMessage = ({ emittedInputMessage, emittedTime }: ChatsPrivateMessageEventType) => {
    // Add message locally
    const message = {
      userInformation: {
        id: this.state.myUser!.id,
        name: computeAttenderDisplayName(this.state.myUser!),
        picture: this.state.myUser!.picture,
      },
      type: 'text/plain',
      time: emittedTime,
      data: emittedInputMessage,
      language: getUserLanguage(),
    };

    this.setState(({ messages, headerChats }) => {
      this.props.socket.emit('private-message', {
        toUser: getSelectedHeaderChat(headerChats).user,
        message,
      });
      return { messages: [...messages, message as MessageType], shouldScrollMessages: true };
    });
  };

  onChatsFileUpload = ({ event }: ChatsFileUploadEventType) => {
    this.setState(({ headerChats, myUser }) => {
      const file = event.target.files![0];

      this.props.socket.emit('put-file-signed-url', {
        fromUser: myUser,
        toUser: getSelectedHeaderChat(headerChats).user,
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
        },
      });

      return { inputFileEvent: event };
    });
  };

  onChatsChatMessages = () => {
    // this event is emitted when next page of messages is requested
    // and there is a next page to request
    if (
      this.state.lastEvaluatedKey &&
      this.state.lastEvaluatedKey.lastEvaluatedPK !== undefined &&
      this.state.lastEvaluatedKey !== undefined
    )
      this.props.socket.emit('chat-messages', {
        withUser: getSelectedHeaderChat(this.state.headerChats).user,
        lastEvaluatedKey: this.state.lastEvaluatedKey,
      });
  };

  onPutFileSignedUrl = async ({ signedUrl }: { signedUrl: string }) => {
    try {
      const response = await axios.put(signedUrl, this.state.inputFileEvent!.target!.files![0]!, {
        headers: { 'Content-Type': this.state.inputFileEvent!.target!.files![0]!.type },
      });

      console.log(this.state.inputFileEvent);
      // this.state.inputFileEvent!.target!.files!.length = 0;
      // this.state.inputFileEvent!.target! = null;

      const message = {
        userInformation: {
          id: this.state.myUser!.id,
          name: computeAttenderDisplayName(this.state.myUser!),
          picture: this.state.myUser!.picture,
        },
        time: Date.now(),
        type: this.state.inputFileEvent!.target!.files![0].type,
        data: signedUrl.split('?')[0],
        alt: '',
      } as MediaMessageType;

      this.setState(({ messages, headerChats }) => {
        this.props.socket.emit('private-message', { toUser: getSelectedHeaderChat(headerChats).user, message });
        return {
          messages: [...messages, message],
          shouldScrollMessages: true,
          inputFileEvent: undefined,
        };
      });
    } catch (e) {
      console.log('🚀  -> file: ChatManager.tsx  -> line 268  -> e', e);
    }
  };

  onNotifications = ({ usersInformation }: NotificationsEventType) => {
    // TODO: add userinformation to headerchat with
    // notifications: 1, online: false, selected: false
    console.log('🚀  -> file: ChatManager.tsx  -> line 283  -> usersInformation', usersInformation);
    const newHeaderChats: HeaderChatType[] = [];
    usersInformation.forEach((userInformation: UserAttributes) => {
      const newHeaderChat: HeaderChatType = { user: userInformation, notifications: 1, online: false, selected: false };
      if (!newHeaderChats.find((headerChat) => headerChat.user.id === newHeaderChat.user.id))
        newHeaderChats.push(newHeaderChat);
    });

    this.setState(({ headerChats }) => ({ headerChats: [...headerChats, ...newHeaderChats] }));
  };

  onChatMessages = ({ withUser, data }: ChatMessagesEventType) => {
    // if the selected header chat changed in the meantime, ignore this response
    // else process it
    if (getSelectedHeaderChat(this.state.headerChats).user.id === withUser.id) {
      console.log('here2');
      const lastEvaluatedKey = {
        lastEvaluatedPK: data.lastEvaluatedPK,
        lastEvaluatedSK: data.lastEvaluatedSK,
      };
      // if this is the first page load then don't request a paginated response
      if (this.state.lastEvaluatedKey === undefined) {
        this.setState({
          messages: data.items as MessageType[],
          areMessagesInInitialLoad: false,
          shouldScrollMessages: true,
          lastEvaluatedKey,
        });
      } else {
        if (
          this.state.lastEvaluatedKey &&
          this.state.lastEvaluatedKey.lastEvaluatedPK !== undefined &&
          this.state.lastEvaluatedKey.lastEvaluatedSK !== undefined
        )
          this.setState(({ messages }) => ({
            messages: [...(data.items as MessageType[]), ...messages],
          }));

        this.setState({
          areMessagesInInitialLoad: false,
          shouldScrollMessages: false,
          lastEvaluatedKey,
        });
      }
    }
  };

  onPrivateMessage = async ({ fromUser, message }: PrivateMessageEventType) => {
    this.setState(({ headerChats, messages, shouldScrollMessages }) => {
      let newMessages = messages;
      let newShouldScrollMessages = shouldScrollMessages;
      let newHeaderChats = headerChats;

      if (getSelectedHeaderChat(headerChats).user.id === fromUser.id) {
        // if the header chat is opened simply append the message
        newMessages = [...messages, message];
        newShouldScrollMessages = true;
      } else if (isHeaderChatWithIdInHeaderChatArray(headerChats, fromUser.id)) {
        // if the user has this chat opened but not selected then add notification to it
        newHeaderChats = headerChats.map((headerChat) => {
          if (headerChat.user.id === fromUser.id) return { ...headerChat, notifications: headerChat.notifications + 1 };
          return headerChat;
        });
      } else {
        // if the user doesn't have this chat opened then add it
        const headerChat = {
          user: fromUser,
          notifications: 1,
          selected: false,
          online: true,
        };
        newHeaderChats = [...headerChats, headerChat];
      }

      return {
        headerChats: newHeaderChats,
        messages: newMessages,
        shouldScrollMessages: newShouldScrollMessages,
      };
    });
  };

  onConnectedUsers = (connectedUserIds: string[]) => {
    console.log('🚀  -> file: ChatManager.tsx  -> line 345  -> connectedUserIds', connectedUserIds);
    // @ts-ignore
    this.setState(({ headerChats }) => {
      const newHeaderChats = headerChats.map((headerChat) => {
        if (connectedUserIds.find((id) => id === headerChat.user.id)) return { ...headerChat, online: true };
        return { ...headerChat, online: false };
      });
      return { headerChats: newHeaderChats };
    });
  };

  onUserStateChange = ({ userId, state }: UserOnlineStateEventType) => {
    // @ts-ignore
    this.setState(({ headerChats }) => {
      const newHeaderChats = headerChats.map((headerChat) => {
        if (headerChat.user.id === userId) return { ...headerChat, online: state };
        return { ...headerChat };
      });
      return { headerChats: newHeaderChats };
    });
  };

  componentDidMount() {
    this.props.emitter.on('chats:close-chat', this.onChatsCloseChat);
    this.props.emitter.on('chats:opened-chat', this.onChatsOpenedChat);
    this.props.emitter.on('chats:change-chat', this.onChatsChangeChat);
    this.props.emitter.on('chats:private-message', this.onChatsPrivateMessage);
    this.props.emitter.on('chats:file-upload', this.onChatsFileUpload);
    this.props.emitter.on('chats:chat-messages', this.onChatsChatMessages);

    this.props.socket.on('put-file-signed-url', this.onPutFileSignedUrl);
    this.props.socket.on('notifications', this.onNotifications);
    this.props.socket.on('chat-messages', this.onChatMessages);
    this.props.socket.on('private-message', this.onPrivateMessage);
    this.props.socket.on('connected-users', this.onConnectedUsers);
    this.props.socket.on('user-state-change', this.onUserStateChange);

    this.props.getSession().then((userSession) => {
      const userAttributes = getAttributesFromSession(userSession);
      this.setState({ myUser: userAttributes });
    });

    this.setState({ areMessagesInInitialLoad: true });
    console.log('before emitting chat-messages');
    console.log('🚀  -> file: ChatManager.tsx  -> line 417  -> this.state.headerChats', this.state.headerChats);
    console.log(
      '🚀  -> file: ChatManager.tsx  -> line 417  -> getSelectedHeaderChat(this.state.headerChats).user',
      getSelectedHeaderChat(this.state.headerChats).user,
    );
    this.props.socket.emit('chat-messages', { withUser: getSelectedHeaderChat(this.state.headerChats).user });
  }

  componentDidUpdate(prevProps: ChatManagerComponentProps, prevState: ChatManagerComponentState) {
    if (
      getSelectedHeaderChat(prevState.headerChats).user.id !== getSelectedHeaderChat(this.state.headerChats).user.id
    ) {
      console.log('here');
      this.setState({ areMessagesInInitialLoad: true });
      this.props.socket.emit('chat-messages', {
        withUser: getSelectedHeaderChat(this.state.headerChats).user,
      });
    }
    //   const selectedHeaderChat = getSelectedHeaderChat(headerChats);
  }

  componentWillUnmount() {
    this.props.emitter.off('chats:close-chat', this.onChatsCloseChat);
    this.props.emitter.off('chats:opened-chat', this.onChatsOpenedChat);
    this.props.emitter.off('chats:change-chat', this.onChatsChangeChat);
    this.props.emitter.off('chats:private-message', this.onChatsPrivateMessage);
    this.props.emitter.off('chats:file-upload', this.onChatsFileUpload);
    this.props.emitter.off('chats:chat-messages', this.onChatsChatMessages);

    this.props.socket.off('put-file-signed-url', this.onPutFileSignedUrl);
    this.props.socket.off('chat-messages', this.onChatMessages);
    this.props.socket.off('private-message', this.onPrivateMessage);
    this.props.socket.off('connected-users', this.onConnectedUsers);
    this.props.socket.off('user-state-change', this.onUserStateChange);

    setPersistedHeaderChats(this.state.headerChats);
  }

  render() {
    if (this.state.myUser === undefined) return <></>;

    return (
      <Container>
        <Paper elevation={1}>
          <ChatHeader emitter={this.props.emitter} headerChats={this.state.headerChats} stageId={this.stageId} />
          <ChatBody
            emitter={this.props.emitter}
            headerChat={getSelectedHeaderChat(this.state.headerChats)}
            areMessagesInInitialLoad={this.state.areMessagesInInitialLoad}
            shouldScrollMessages={this.state.shouldScrollMessages}
            messages={this.state.messages}
            myUser={this.state.myUser}
          />
          <ChatFooter
            emitter={this.props.emitter}
            inputMessage={this.state.inputMessage}
            setState={this.setState.bind(this)}
          />
        </Paper>
      </Container>
    );
  }
}

// const ChatManager = () => {
//   const { getSession } = useContext(AccountContext.Context);
//   const socket = useContext(SocketContext.Context).chatSocket!;
//   const { emitter } = useContext(SocketContext.Context);
//   const [myUser, setMyUser] = useState<UserAttributes>(undefined as unknown as UserAttributes);
//   const [headerChats, setHeaderChats] = useState<HeaderChatType[]>([
//     {
//       user: {
//         id: 'global',
//         givenName: 'Global',
//         familyName: 'Chat',
//         email: 'global@think-in.me',
//         emailVerified: true,
//         picture: 'https://think-in-content.s3.eu-central-1.amazonaws.com/avatars/global.jpg',
//       },
//       notifications: 0,
//       selected: true,
//       online: true,
//     },
//     {
//       user: {
//         id: 'stage',
//         givenName: 'Stage',
//         familyName: 'Chat',
//         email: 'stage@think-in.me',
//         emailVerified: true,
//         picture: 'https://think-in-content.s3.eu-central-1.amazonaws.com/avatars/stage.jpg',
//       },
//       notifications: 0,
//       selected: false,
//       online: true,
//     },
//   ]);
//   const [areMessagesInInitialLoad, setAreMessagesInInitialLoad] = useState<boolean>();
//   const [shouldScrollMessages, setShouldScrollMessages] = useState<boolean>();
//   const [lastEvaluatedKey, setLastEvaluatedKey] = useState<LastEvaluatedKey>();
//   const [messages, setMessages] = useState<MessageType[]>([]);
//   const [inputMessage, setInputMessage] = useState<string>('');

//   useEffect(() => {
//     if (myUser === undefined) {
//       getSession().then((userSession) => {
//         const userAttributes = getAttributesFromSession(userSession);
//         setMyUser(userAttributes);
//         // socket.emit('set-attender', userAttributes);
//       });
//     } else {
//       emitter.on('chats:close-chat', (chatIndex: number) => {
//         setHeaderChats((headerChats) => {
//           const newHeaderChats = headerChats.filter((headerChat, index) => index !== chatIndex);

//           /**
//            * if the header chat that was deleted was the one selected,
//            * then select the global chat
//            */
//           if (
//             newHeaderChats
//               .map((headerChat) => headerChat.selected)
//               .every((selected) => selected === false)
//           )
//             newHeaderChats[0].selected = true;
//           return newHeaderChats;
//         });

//         // reset last evaluated key
//         setLastEvaluatedKey(undefined);
//       });

//       emitter.on('chats:opened-chat', (userAttributes: UserAttributes) => {
//         // emitted when chat was opened from attender dialog popup
//         setHeaderChats((headerChats) => {
//           // if the chat is already opened just set it to selected
//           if (isHeaderChatWithIdInHeaderChatArray(headerChats, userAttributes.id))
//             return headerChats.map((headerChat) => {
//               if (headerChat.user.id === userAttributes.id) {
//                 headerChat.selected = true;
//                 headerChat.notifications = 0;
//               } else {
//                 headerChat.selected = false;
//               }
//               return headerChat;
//             });

//           // otherwise add it and set it to selected
//           const headerChat = {
//             user: userAttributes,
//             notifications: 0,
//             selected: true,
//             online: true,
//           };
//           return [
//             ...headerChats.map((headerChat) => ({ ...headerChat, selected: false })),
//             headerChat,
//           ];
//         });

//         // reset last evaluated key
//         setLastEvaluatedKey(undefined);
//       });

//       emitter.on('chats:change-chat', (chatIndex: number) => {
//         // chatIndex is always a number
//         setHeaderChats((headerChats) =>
//           headerChats.map((headerChat, index) => {
//             if (index === chatIndex) {
//               headerChat.selected = true;
//               headerChat.notifications = 0;
//             } else {
//               headerChat.selected = false;
//             }
//             return headerChat;
//           }),
//         );

//         // reset last evaluated key
//         setLastEvaluatedKey(undefined);
//       });

//       emitter.on(
//         'chats:private-message',
//         ({ emittedInputMessage, emittedTime }: ChatsPrivateMessageEventType) => {
//           // Add message locally
//           const message = {
//             userInformation: { id: myUser.id, name: computeAttenderDisplayName(myUser) },
//             type: 'text/plain',
//             time: emittedTime,
//             data: emittedInputMessage,
//             language: getUserLanguage(),
//           };
//           setMessages((messages) => {
//             setShouldScrollMessages(true);
//             return [...messages, message as MessageType];
//           });

//           /**
//            * Use setHeaderChats in order to get the latest headerChats and avoid headerChats closure
//            */
//           setHeaderChats((headerChats) => {
//             // Send message to websocket server
//             socket.emit('private-message', {
//               toUser: getSelectedHeaderChat(headerChats).user,
//               message,
//             });
//             return headerChats;
//           });
//         },
//       );

//       // event: React.ChangeEvent<HTMLInputElement>
//       emitter.on('chats:file-upload', ({ event, emittedTime }: ChatsFileUploadEventType) => {
//         const file = event.target.files![0];
//         const fileReader = new FileReader();
//         fileReader.readAsDataURL(file);
//         fileReader.addEventListener('load', (event: any) => {
//           // Add message locally
//           const message = {
//             userInformation: { id: myUser.id, name: computeAttenderDisplayName(myUser) },
//             time: emittedTime,
//             type: 'image/jpeg',
//             data: event.target.result,
//             alt: '',
//           } as MediaMessageType;
//           setMessages((messages) => {
//             setShouldScrollMessages(true);
//             return [...messages, message];
//           });

//           // TODO: upload image to s3 from client side, send message to websocket server

//           event.target.value = null;
//         });
//       });

//       emitter.on('chats:chat-messages', ({ withUser }) => {
//         // this event is emitted when next page of messages is requested
//         setLastEvaluatedKey((lastEvaluatedKey) => {
//           if (
//             lastEvaluatedKey &&
//             lastEvaluatedKey.lastEvaluatedPK !== undefined &&
//             lastEvaluatedKey.lastEvaluatedSK !== undefined
//           ) {
//             console.log('emitted message');
//             console.log(
//               '🚀  -> file: ChatManager.tsx  -> line 248  -> lastEvaluatedKey',
//               lastEvaluatedKey,
//             );
//             socket.emit('chat-messages', { withUser, lastEvaluatedKey });
//           }
//           return lastEvaluatedKey;
//         });
//       });

//       socket.on('private-message', async ({ fromUser, message }: PrivateMessageEventType) => {
//         /**
//          * Use setHeaderChats in order to get the latest headerChats and avoid headerChats closure
//          */
//         console.log('🚀  -> file: ChatManager.tsx  -> line 294  -> fromUser', fromUser);
//         console.log('🚀  -> file: ChatManager.tsx  -> line 270  -> message', message);
//         // let chatId = fromUser.id;
//         // let userId = fromUser.id;

//         // // Special case for global and stage chats
//         // if (Array.isArray(fromUser.id)) {
//         //   [chatId] = fromUser.id;
//         //   [, userId] = fromUser.id;
//         // }

//         setHeaderChats((headerChats) => {
//           // // if the message is in the global/stage chat and the global/stage chat is opened
//           // // then simply append the message
//           // if (
//           //   ['global', 'stage'].includes(fromUser.id) &&
//           //   getSelectedHeaderChat(headerChats).user.id === fromUser.id
//           // ) {
//           //   setMessages((messages) => {
//           //     setShouldScrollMessages(true);
//           //     return [...messages, message];
//           //   });
//           // }

//           if (fromUser.id === getSelectedHeaderChat(headerChats).user.id) {
//             // if the user has this chat opened and selected then simply append the message
//             setMessages((messages) => {
//               setShouldScrollMessages(true);
//               return [...messages, message];
//             });
//             return headerChats;
//           }

//           if (isHeaderChatWithIdInHeaderChatArray(headerChats, fromUser.id)) {
//             // if the user has this chat opened but not selected then add notification to it
//             return headerChats.map((headerChat) => {
//               if (headerChat.user.id === fromUser.id) {
//                 headerChat.notifications += 1;
//               }
//               return headerChat;
//             });
//           }

//           // if the user doesn't have this chat opened then add it
//           const headerChat = {
//             user: fromUser,
//             notifications: 1,
//             selected: false,
//             online: true,
//           };
//           return [...headerChats, headerChat];
//         });
//       });

//       socket.on('chat-messages', ({ withUser, data }: ChatMessagesEventType) => {
//         // use setHeaderChats in order to get last updated headerChats
//         let _headerChats: unknown;
//         setHeaderChats((headerChats) => {
//           _headerChats = headerChats;
//           return headerChats;
//         });

//         // if the selected header chat changed in the meantime, ignore this response
//         if (getSelectedHeaderChat(_headerChats as HeaderChatType[]).user.id === withUser.id) {
//           // else process it
//           let _areMessagesInInitialLoad: unknown;
//           // use setAreMessagesInInitialLoad in order to get last updated areMessagesInInitialLoad
//           setAreMessagesInInitialLoad((areMessagesInInitialLoad) => {
//             _areMessagesInInitialLoad = areMessagesInInitialLoad;
//             return false;
//           });

//           if (_areMessagesInInitialLoad) setShouldScrollMessages(true);
//           else setShouldScrollMessages(false);
//         }

//         let _lastEvaluatedKey: LastEvaluatedKey | undefined;
//         setLastEvaluatedKey((lastEvaluatedKey) => {
//           _lastEvaluatedKey = lastEvaluatedKey;
//           return {
//             lastEvaluatedPK: data.lastEvaluatedPK,
//             lastEvaluatedSK: data.lastEvaluatedSK,
//           };
//         });

//         console.log(
//           '🚀  -> file: ChatManager.tsx  -> line 316  -> _lastEvaluatedKey',
//           _lastEvaluatedKey,
//         );
//         console.log('🚀  -> file: ChatManager.tsx  -> line 313  -> data', data);
//         if (_lastEvaluatedKey === undefined) setMessages(data.items as MessageType[]);

//         if (
//           _lastEvaluatedKey &&
//           _lastEvaluatedKey.lastEvaluatedPK !== undefined &&
//           _lastEvaluatedKey.lastEvaluatedSK !== undefined
//         ) {
//           setMessages((messages) => [...(data.items as MessageType[]), ...messages]);
//         }

//         // if (_lastEvaluatedKey) {
//         //   console.log(
//         //     '🚀  -> file: ChatManager.tsx  -> line 313  -> _lastEvaluatedKey',
//         //     _lastEvaluatedKey,
//         //   );
//         //   console.log('🚀  -> file: ChatManager.tsx  -> line 319  -> data', data);
//         //   if (
//         //     _lastEvaluatedKey.lastEvaluatedPK !== data.lastEvaluatedPK &&
//         //     _lastEvaluatedKey.lastEvaluatedSK !== data.lastEvaluatedSK
//         //   ) {
//         //     // load next page of messages
//         //     setMessages((messages) => [...(data.items as MessageType[]), ...messages]);
//         //   }
//         // } else {
//         //   setMessages(data.items as MessageType[]);
//         // }
//         // console.log('here');
//         // setHeaderChats((headerChats) => {
//         //   console.log('here2');
//         //   // if the selected header chat changed in the meantime, ignore this response
//         //   if (getSelectedHeaderChat(headerChats).user.id === withUser.id) {
//         //     // else process it
//         //     setAreMessagesInInitialLoad((areMessagesInInitialLoad) => {
//         //       console.log('here3');
//         //       console.log(
//         //         '🚀  -> file: ChatManager.tsx  -> line 297  -> areMessagesInInitialLoad',
//         //         areMessagesInInitialLoad,
//         //       );
//         //       if (areMessagesInInitialLoad) setShouldScrollMessages(true);
//         //       else setShouldScrollMessages(false);
//         //       return false;
//         //     });

//         //     if (data.lastEvaluatedPK && data.lastEvaluatedSK)
//         //       setLastEvaluatedKey({
//         //         lastEvaluatedPK: data.lastEvaluatedPK,
//         //         lastEvaluatedSK: data.lastEvaluatedSK,
//         //       });

//         //     setMessages((messages) => {
//         //       if (lastEvaluatedKey)
//         //         if (
//         //           lastEvaluatedKey.lastEvaluatedPK !== data.lastEvaluatedPK &&
//         //           lastEvaluatedKey.lastEvaluatedSK !== data.lastEvaluatedSK
//         //         ) {
//         //           // load next page of messages
//         //           return [...(data.items as MessageType[]), ...messages];
//         //         }
//         //       // first time loading messages
//         //       return data.items as MessageType[];
//         //     });
//         //   }
//         //   return headerChats; // won't trigger a re-render because of reference equality.
//         // });
//       });

//       socket.on('file-upload', (response) => {
//         if (!response.success) {
//           setInputMessage('Failed uploading image.');
//           return;
//         }
//         setInputMessage(`${response.imageLink} ${response.caption}`);
//       });

//       socket.on('connected-users', (connectedUserIds: string[]) => {
//         setHeaderChats((headerChats) => {
//           headerChats.forEach((headerChat) => {
//             if (connectedUserIds.find((connectedUserId) => connectedUserId === headerChat.user.id))
//               headerChat.online = true;
//           });
//           return [...headerChats];
//         });
//       });

//       socket.on('user-state-change', ({ userId, state }: UserOnlineStateEventType) => {
//         setHeaderChats((headerChats) => {
//           headerChats.forEach((headerChat) => {
//             if (headerChat.user.id === userId) headerChat.online = state;
//           });
//           return [...headerChats];
//         });
//       });
//     }
//   }, [myUser]);

//   const selectedHeaderChat = getSelectedHeaderChat(headerChats);
//   useEffect(() => {
//     setAreMessagesInInitialLoad(true);
//     socket.emit('chat-messages', { withUser: selectedHeaderChat.user });
//   }, [selectedHeaderChat]);

//   if (myUser === undefined) return <></>;

//   return (
//     <Container>
//       <Paper elevation={1}>
//         <ChatHeader emitter={emitter} headerChats={headerChats} />
//         <ChatBody
//           emitter={emitter}
//           headerChat={getSelectedHeaderChat(headerChats)}
//           areMessagesInInitialLoad={areMessagesInInitialLoad}
//           shouldScrollMessages={shouldScrollMessages}
//           messages={messages}
//           myUser={myUser}
//         />
//         <ChatFooter
//           emitter={emitter}
//           inputMessage={inputMessage}
//           setInputMessage={setInputMessage}
//         />
//       </Paper>
//     </Container>
//   );
// };

// export { getSelectedHeaderChat };
// export default ChatManager;

const ChatManager: React.FunctionComponent = () => {
  const { getSession } = useContext(AccountContext.Context);
  const socket = useContext(SocketContext.Context).chatSocket!;
  const { emitter } = useContext(SocketContext.Context);

  return <ChatManagerComponent getSession={getSession} socket={socket} emitter={emitter} />;
};

export default ChatManager;
