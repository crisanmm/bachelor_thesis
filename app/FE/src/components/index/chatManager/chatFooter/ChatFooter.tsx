import React, { SetStateAction } from 'react';
import { Box, Button, IconButton, Input, TextField, Tooltip } from '@material-ui/core';
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
          emitter.emit('chats:file-upload', { event: e, emittedTime: Date.now() });
        }}
      />
      <StyledButtonList>
        <Tooltip title="Attach a photo or video" arrow>
          <IconButton component="span">
            <Photo />
          </IconButton>
        </Tooltip>
      </StyledButtonList>
    </label>

    <Box
      component="form"
      id="chat-message"
      onSubmit={(e) => {
        // Prevent form submission
        e.preventDefault();

        // Signal event to ChatManager
        emitter.emit('chats:private-message', {
          emittedInputMessage: inputMessage,
          emittedTime: Date.now(),
        });

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
      <Tooltip title="Send message" arrow>
        <IconButton type="submit" form="chat-message" color="primary">
          <Send />
        </IconButton>
      </Tooltip>
    </StyledSendButton>
  </StyledChatFooter>
);

export default ChatFooter;
