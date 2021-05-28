import chalk from 'chalk';
import { Server } from 'socket.io';
import axios from 'axios';
import { createHash } from 'crypto';
import * as uuid from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as mime from 'mime-types';
import { getLanguages, translateText } from '../utils/cloud-translation';
import type { AttenderType, MessageType } from '../shared';

const s3 = new S3Client({});
const API_URL = 'https://api.think-in.me/dev';

const getAPIHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

interface PrivateMessageEventType {
  toUser: AttenderType;
  message: MessageType;
}

interface PutFileSignedUrlEventType {
  fromUser: AttenderType;
  toUser: AttenderType;
  file: {
    name: File['name'];
    type: File['type'];
    size: File['size'];
  };
}

interface LastEvaluatedKey {
  lastEvaluatedPK: string;
  lastEvaluatedSK: string;
}

interface ChatMessagesEventType {
  withUser: AttenderType;
  lastEvaluatedKey: LastEvaluatedKey;
}

interface ComputeChatId {
  (...userIds: string[]): string;
}

const registerListeners = (io: Server) => {
  let computeChatId: ComputeChatId;

  const userIdToSocketIdMap = new Map<string, string>();
  userIdToSocketIdMap.set('global', 'global');

  io.of('/chats').use((socket, next) => {
    socket.join('global');
    socket.join(socket.handshake.auth.stageId!);
    userIdToSocketIdMap.set(socket.handshake.auth.stageId! as string, socket.handshake.auth.stageId! as string);
    userIdToSocketIdMap.set(socket.idTokenDecoded.sub, socket.id);
    userIdToSocketIdMap.set(socket.handshake.auth.stageId as string, socket.handshake.auth.stageId as string);

    computeChatId = (...userIds) => {
      if (userIds.includes('global')) return 'global';
      if (userIds.includes(socket.handshake.auth.stageId)) return socket.handshake.auth.stageId;

      const hash = createHash('sha256');
      for (const id of userIds.sort()) hash.update(id);
      return hash.digest('hex');
    };
    next();
  });

  io.of('/chats').on('connection', async (socket) => {
    console.log('Has joined the chat:');
    console.log(`      ${socket.idTokenDecoded.given_name} ${socket.idTokenDecoded.family_name}`);
    console.log(`      ${socket.idTokenDecoded.sub}`);
    console.log(`      ${socket.id}`);

    socket.onAny((eventName) => {
      console.log(chalk.bold.yellow(`CHAT: received event ${eventName}`));
    });

    socket.on('private-message', async ({ toUser, message }: PrivateMessageEventType) => {
      const url = new URL(`${API_URL}/chats/${computeChatId(toUser.id, socket.attender.id)}`);
      console.log('🚀  -> file: chats.ts  -> line 81  -> message', message);
      console.log('🚀  -> file: chats.ts  -> line 81  -> toUser', toUser);
      try {
        await axios.post(url.toString(), message, { headers: getAPIHeaders(socket.idToken) });
        if (userIdToSocketIdMap.has(toUser.id)) {
          // toUser is online, directly send message
          let emitMessage;
          switch (toUser.id) {
            case 'global':
            case 'stage':
              // toUser is global/stage chat in this case
              emitMessage = { fromUser: toUser, message };
              io.of('/chats').except(socket.id).emit('private-message', emitMessage);
              break;

            default:
              emitMessage = { fromUser: socket.attender, message };
              if (userIdToSocketIdMap.has(toUser.id)) {
                socket.to(userIdToSocketIdMap.get(toUser.id) as string).emit('private-message', emitMessage);
              }
          }
        } else {
          // toUser is offline, save notification to DB, notify user upon next log in
          // TODO: Send email to user.
          await axios.post(`${API_URL}/notifications/${toUser.id}`, socket.attender, {
            headers: getAPIHeaders(socket.idToken),
          });
        }
      } catch (e) {
        console.log('🚀  -> file: chats.ts  -> line 134  -> e', e);
      }
    });

    socket.on('chat-messages', async ({ withUser, lastEvaluatedKey }: ChatMessagesEventType) => {
      const url = new URL(`${API_URL}/chats/${computeChatId(withUser.id, socket.attender.id)}`);
      console.log('🚀  -> file: chats.ts  -> line 110  -> lastEvaluatedKey', lastEvaluatedKey);
      if (lastEvaluatedKey) {
        url.searchParams.append('lastEvaluatedPK', lastEvaluatedKey.lastEvaluatedPK);
        url.searchParams.append('lastEvaluatedSK', lastEvaluatedKey.lastEvaluatedSK);
      }

      try {
        const { data } = await axios.get(url.toString(), {
          headers: getAPIHeaders(socket.idToken),
        });

        // the last messages are received sorted by time in descending order
        // sort them in ascending order
        data.data.items.sort((message1: MessageType, message2: MessageType) => message1.time - message2.time);
        socket.emit('chat-messages', { withUser, data: data.data });
      } catch (e) {
        console.log('🚀  -> file: chats.ts  -> line 119  -> e', e);
        console.log(e.response.data.error);
      }
    });

    socket.on('put-file-signed-url', async ({ fromUser, toUser, file }: PutFileSignedUrlEventType) => {
      const command = new PutObjectCommand({
        Bucket: 'think-in-content',
        Key: `${computeChatId(fromUser.id, toUser.id)}/${uuid.v4()}.${mime.extension(file.type)}`,
        ACL: 'bucket-owner-full-control',
        ContentType: file.type,
      });
      const signedUrl = await getSignedUrl(s3, command);
      console.log('🚀  -> file: chats.ts  -> line 164  -> signedUrl', signedUrl);
      socket.emit('put-file-signed-url', { signedUrl });
    });

    socket.on('disconnect', () => {
      io.of('/chats').except(socket.id).emit('user-state-change', { userId: socket.idTokenDecoded.sub, state: false });
      userIdToSocketIdMap.delete(socket.idTokenDecoded.sub);
    });

    try {
      /**
       * Query the database to see if the user has received messages while offline
       */
      const URL = `${API_URL}/notifications/${socket.attender.id}`;

      const response = await axios.get(URL, { headers: getAPIHeaders(socket.idToken) });
      if (response.data.data.items.length !== 0) {
        // if there were received messages while offine, notify the client of these messages
        socket.emit('notifications', { usersInformation: response.data.data.items });
        // and remove the notifications from the database so they don't appear next time the user logs in
        await axios.delete(URL, { headers: getAPIHeaders(socket.idToken) });
      }
    } catch (e) {
      console.log('🚀  -> file: chats.ts  -> line 80  -> e', e);
    }

    /**
     * Notify the user that has just connected of the other connected users.
     */
    socket.emit('connected-users', Array.from(userIdToSocketIdMap.keys()));

    /**
     * Notify all the other users of the user that has just connected.
     */
    io.of('/chats').except(socket.id).emit('user-state-change', { userId: socket.idTokenDecoded.sub, state: true });
  });
};

export default registerListeners;
