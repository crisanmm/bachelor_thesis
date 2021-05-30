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
  translateMessage,
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

interface PutFileSignedUrlEventType {
  putSignedUrl: string;
  getSignedUrl: string;
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
      language: getUserLanguage(this.state.myUser!),
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

  onPutFileSignedUrl = async ({ getSignedUrl, putSignedUrl }: PutFileSignedUrlEventType) => {
    try {
      const response = await axios.put(putSignedUrl, this.state.inputFileEvent!.target!.files![0]!, {
        headers: { 'Content-Type': this.state.inputFileEvent!.target!.files![0]!.type },
      });

      const message = {
        userInformation: {
          id: this.state.myUser!.id,
          name: computeAttenderDisplayName(this.state.myUser!),
          picture: this.state.myUser!.picture,
        },
        time: Date.now(),
        type: this.state.inputFileEvent!.target!.files![0].type,
        data: getSignedUrl,
        alt: '',
      } as MediaMessageType;

      // @ts-ignore
      this.state.inputFileEvent!.target!.value! = null;

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

  onChatMessages = async ({ withUser, data }: ChatMessagesEventType) => {
    data.items = await Promise.all(
      data.items.map((message) => translateMessage(message, getUserLanguage(this.state.myUser!))),
    );

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
    message = await translateMessage(message, getUserLanguage(this.state.myUser!));
    console.log('🚀  -> file: ChatManager.tsx  -> line 337  -> message', message);
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
      this.setState({ myUser: userAttributes }, () => console.log(getUserLanguage(this.state.myUser!)));
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

const ChatManager: React.FunctionComponent = () => {
  const { getSession } = useContext(AccountContext.Context);
  const socket = useContext(SocketContext.Context).chatSocket!;
  const { emitter } = useContext(SocketContext.Context);

  return <ChatManagerComponent getSession={getSession} socket={socket} emitter={emitter} />;
};

export default ChatManager;
