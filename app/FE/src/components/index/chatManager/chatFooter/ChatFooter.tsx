import React, { SetStateAction } from 'react';
import { Box, Button, IconButton, Input, TextField } from '@material-ui/core';
import { Photo, Send } from '@material-ui/icons';
import { Emitter } from 'mitt';
import {
  StyledChatFooter,
  StyledSendButton,
  StyledButtonList,
  StyledTextField,
} from './ChatFooter.style';

interface ChatFooterProps {
  emitter: Emitter;
  inputMessage: string;
  setInputMessage: React.Dispatch<SetStateAction<string>>;
}

const ChatFooter: React.FunctionComponent<ChatFooterProps> = ({
  emitter,
  inputMessage,
  setInputMessage,
}) => (
  <StyledChatFooter>
    <label htmlFor="image-upload">
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          // Signal event to ChatManager
          emitter.emit('chats:file-upload', e);

          // console.dir(e.target);
          // const file = e.target.files[0];
          // const fileReader = new FileReader();
          // fileReader.readAsDataURL(file);
          // fileReader.addEventListener('load', (e: any) => {
          //   socket.current!.emit('file-upload', e.target.result);
          // });
          // // remove attached file
          // e.target.value = null;
        }}
      />
      <StyledButtonList>
        <IconButton component="span">
          <Photo />
        </IconButton>
      </StyledButtonList>
    </label>

    <Box
      component="form"
      id="chat-message"
      onSubmit={(e) => {
        // Prevent form submission
        e.preventDefault();

        // Signal event to ChatManager
        emitter.emit('chats:private-message', inputMessage);

        // Clear input message
        setInputMessage('');
      }}
      style={{ width: '100%' }}
    >
      <StyledTextField
        variant="outlined"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        fullWidth
        // rowsMax={2}
        // multiline
      />
    </Box>

    <StyledSendButton>
      <IconButton type="submit" form="chat-message" color="primary">
        <Send />
      </IconButton>
      {/* <Button
        type="submit"
        form="chat-message"
        variant="contained"
        color="primary"
        onClick={() => {
          // if (chatMessage) {
          //   const message = {
          //     user: myId,
          //     type: 'text'
          //     data: chatMessage,
          //     language: myLanguage![0],
          //     time: Date.now(),
          //   };
          //   setMessages((messages) => [...messages, message]);
          //   socket.current!.emit('private-message', {
          //     destinationId: otherIds[0],
          //     message,
          //   });
          //   setChatMessage('');
          // }
        }}
      >
        send
      </Button> */}
    </StyledSendButton>
  </StyledChatFooter>
);

export default ChatFooter;
