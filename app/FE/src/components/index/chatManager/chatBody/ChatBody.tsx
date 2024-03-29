import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Tooltip, CircularProgress } from '@material-ui/core';
import { Emitter } from 'mitt';
import { StyledContainer } from '#components/shared';
import { clamp, computeAttenderDisplayName, UserAttributes, ENDPOINTS, TranslatedMessageType } from '#utils';
import { useAvatar } from '#hooks';
import { AttenderDialogPopUp } from '#components/index';
import {
  StyledMessages,
  StyledMessage,
  StyledTextMessageBody,
  StyledShowOriginalButton,
  StyledImage,
  StyledNoMessagesAvatar,
  StyledMessagesAvatar,
} from './ChatBody.style';
import type { MessageType, MediaMessageType, HeaderChatType } from '../shared';

const computeSpacing = (thisMessage: MessageType, lastMessage: MessageType) => {
  if (!lastMessage) return 0;

  const secondsDifference = (thisMessage.time - lastMessage.time) / 1000;

  /**
   * spacing() function similar to React Material-UI spacing()
   * 1 * 8 = theme.spacing(1)
   * */
  return clamp(0.75 * 8, secondsDifference * 0.005, 6 * 8);
};

interface ChatMessageProps {
  emitter: Emitter;
  message: MessageType;
  myUser: UserAttributes;
  index: number;
  spacing: number;
}

const ChatMessage: React.FunctionComponent<ChatMessageProps> = ({ emitter, message, myUser, index, spacing }) => {
  const isMessageMine = myUser.id === message.userInformation.id;
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);
  const avatar = useAvatar(isMessageMine ? myUser.picture : message.userInformation.picture);
  const [isTranslatedMessageShown, setIsTranslatedMessageShown] = useState<boolean>(
    (message as TranslatedMessageType).translatedData ? true : false,
  );
  const userName = isMessageMine ? computeAttenderDisplayName(myUser) : message.userInformation.name;

  const [additionalUserInformation, setAdditionalUserInformation] = useState<Omit<UserAttributes, 'token'>>();
  const onClickAvatar = async () => {
    if (!isAvatarClicked) {
      try {
        const response = await axios.get(`${ENDPOINTS.USERS}/${message.userInformation.id}`, {
          headers: { Authorization: `Bearer ${myUser.token}` },
        });

        if (response.data.success) {
          const {
            email,
            'email_verified': emailVerified,
            'given_name': givenName,
            'family_name': familyName,
            'custom:custom_facebook': customFacebook,
            'custom:custom_linkedin': customLinkedin,
            'custom:custom_phone': customPhone,
            'custom:custom_job': customJob,
          } = response.data.data;

          setAdditionalUserInformation({
            picture: avatar,
            id: message.userInformation.id,
            email,
            emailVerified,
            givenName,
            familyName,
            customFacebook,
            customLinkedin,
            customPhone,
            customJob,
          });

          setIsAvatarClicked(true);
        }
      } catch (e) {
        console.error('🚀  -> file: ChatBody.tsx  -> line 56  -> e', e);
      }
    }
  };

  const onClickShowOriginal = () => {
    setIsTranslatedMessageShown((isTranslatedMessageShown) => !isTranslatedMessageShown);
  };

  return (
    <>
      <StyledMessage key={index} mine={isMessageMine} _spacing={spacing}>
        <Tooltip title={userName} arrow>
          <div>
            <StyledMessagesAvatar alt={`${userName}'s avatar`} src={avatar} onClick={onClickAvatar} />
          </div>
        </Tooltip>
        <Tooltip title={`Sent at ${new Date(message.time).toLocaleString()}`} arrow>
          {message.type === 'text/plain' ? (
            <StyledTextMessageBody>
              <p>{isTranslatedMessageShown ? (message as TranslatedMessageType).translatedData : message.data}</p>
              {(message as TranslatedMessageType).translatedData && (
                <StyledShowOriginalButton variant="text" onClick={onClickShowOriginal}>
                  show&nbsp;
                  {isTranslatedMessageShown ? 'original' : 'translated'}
                </StyledShowOriginalButton>
              )}
            </StyledTextMessageBody>
          ) : (
            <a href={message.data} target="_blank" rel="noreferrer">
              <StyledImage alt={(message as MediaMessageType).alt} src={message.data} />
            </a>
          )}
        </Tooltip>
      </StyledMessage>
      {isAvatarClicked && (
        <AttenderDialogPopUp
          emitter={emitter}
          userAttributes={additionalUserInformation as UserAttributes}
          isAvatarClicked={isAvatarClicked}
          setIsAvatarClicked={setIsAvatarClicked}
          isMyAttender={isMessageMine}
        />
      )}
    </>
  );
};

interface ChatBodyProps {
  emitter: Emitter;
  headerChat: HeaderChatType;
  areMessagesInInitialLoad: boolean | undefined;
  shouldScrollMessages: boolean | undefined;
  messages: MessageType[];
  myUser: UserAttributes;
}

const ChatBody: React.FunctionComponent<ChatBodyProps> = ({
  emitter,
  headerChat,
  areMessagesInInitialLoad,
  shouldScrollMessages,
  messages,
  myUser,
}) => {
  const fetchNewMessagesRef = (e: HTMLDivElement) => {
    const listener = () => {
      if (e?.scrollTop === 0) {
        emitter.emit('chats:chat-messages');
        e.onscroll = null;
      }
    };
    if (e) e.onscroll = listener;
  };

  const scrollIntoViewRef = (e: HTMLDivElement) => {
    if (shouldScrollMessages && e) {
      // e?.scrollTo({ top: e.scrollHeight });
      // e.scrollTop = 500000;
      e?.scrollIntoView();
    }
  };

  if (areMessagesInInitialLoad)
    return (
      <StyledMessages>
        <StyledContainer>
          <CircularProgress />
        </StyledContainer>
      </StyledMessages>
    );

  if (messages.length === 0)
    return (
      <StyledMessages>
        <StyledContainer>
          <StyledNoMessagesAvatar
            alt={`${computeAttenderDisplayName(headerChat.user)}'s avatar`}
            src={headerChat.user.picture}
          />
          <Typography>
            No messages with
            {` ${computeAttenderDisplayName(headerChat.user)} `}
            yet! Be the first one to interact 😁
          </Typography>
        </StyledContainer>
      </StyledMessages>
    );

  return (
    <StyledMessages ref={fetchNewMessagesRef}>
      {messages.map((message, index) => (
        <ChatMessage
          key={message.userInformation.id + message.time}
          emitter={emitter}
          message={message}
          myUser={myUser}
          index={index}
          spacing={computeSpacing(message, messages[index - 1])}
        />
      ))}
      <div ref={scrollIntoViewRef} />
    </StyledMessages>
  );
};

export { computeSpacing };
export default ChatBody;
