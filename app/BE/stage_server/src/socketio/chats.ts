/* eslint-disable no-lonely-if */
import chalk from 'chalk';
import { Server } from 'socket.io';
import axios from 'axios';
import { createHash } from 'crypto';
import * as uuid from 'uuid';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  PutObjectCommandInput,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl as s3GetSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as mime from 'mime-types';
import type { AttenderType, MessageType } from '../shared';
import { sendEmail } from '../utils/sesEmail';
import { ENDPOINTS, S3_CHATS_BUCKET_NAME, S3_BUCKET_REGION } from '../utils/constants';

const s3 = new S3Client({ region: S3_BUCKET_REGION });
const API_URL = ENDPOINTS.API;

const getAPIHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

interface PrivateMessageEventType {
  toUser: AttenderType;
  message: MessageType;
  isGlobalOrStageChat: boolean;
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
    userIdToSocketIdMap.set(socket.attender.id, socket.id);
    userIdToSocketIdMap.set(socket.handshake.auth.stageId as string, socket.handshake.auth.stageId as string);

    computeChatId = (...userIds) => {
      if (userIds.includes('global')) return 'global';
      if (userIds.includes(socket.handshake.auth.stageId)) return socket.handshake.auth.stageId.toLowerCase();

      const hash = createHash('sha256');
      for (const id of userIds.sort()) hash.update(id);
      return hash.digest('hex');
    };
    next();
  });

  io.of('/chats').on('connection', async (socket) => {
    console.log(userIdToSocketIdMap);
    console.log('Has joined the chat:');
    console.log(`      ${socket.attender.givenName} ${socket.attender.familyName}`);
    console.log(`      ${socket.attender.id}`);
    console.log(`      ${socket.id}`);

    socket.onAny((eventName) => {
      console.log(chalk.bold.yellow(`CHAT: received event ${eventName}`));
    });

    socket.on('private-message', async ({ toUser, message, isGlobalOrStageChat }: PrivateMessageEventType) => {
      console.log('🚀  -> file: chats.ts  -> line 93  -> message', message);
      try {
        if (isGlobalOrStageChat) {
          // message was meant for the global or stage chat
          io.of('/chats').in(toUser.id).except(socket.id).emit('private-message', { message, fromUser: toUser });
        } else {
          // message was meant for a user, check if the user is online
          if (userIdToSocketIdMap.has(toUser.id)) {
            // toUser is online, directly send message
            socket
              .to(userIdToSocketIdMap.get(toUser.id) as string)
              .emit('private-message', { message, fromUser: socket.attender });
          } else {
            // toUser is offline, save notification to DB, notify user upon next log in and send email of notification
            // only send email for the first unread message
            // verify there are no other unread messages before sending email
            const response = await axios.get(`${API_URL}/notifications/${toUser.id}`, {
              headers: getAPIHeaders(socket.idToken),
            });
            if (response.data.data.items.length === 0) {
              await sendEmail({ destinationEmail: toUser.email, fromUser: socket.attender, message });
              console.log(`Email sent to ${toUser.email}`);
            }

            // save notification to DB
            await axios.post(`${API_URL}/notifications/${toUser.id}`, socket.attender, {
              headers: getAPIHeaders(socket.idToken),
            });
          }
        }

        // save message to DB
        const url = new URL(`${API_URL}/chats/${computeChatId(toUser.id, socket.attender.id)}`);
        await axios.post(url.toString(), message, { headers: getAPIHeaders(socket.idToken) });
      } catch (e) {
        console.error('🚀  -> file: chats.ts  -> line 134  -> e', e);
      }
    });

    socket.on('chat-messages', async ({ withUser, lastEvaluatedKey }: ChatMessagesEventType) => {
      const url = new URL(`${API_URL}/chats/${computeChatId(withUser.id, socket.attender.id)}`);
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
        // generate a presigned url for media content hosted on S3
        for (const message of data.data.items) {
          if (message.type.startsWith('image')) {
            // eslint-disable-next-line no-await-in-loop
            const getSignedUrl = await s3GetSignedUrl(
              s3,
              new GetObjectCommand({
                Bucket: S3_CHATS_BUCKET_NAME,
                Key: new URL(message.data.split('?')[0]).pathname.slice(1),
                ResponseContentType: message.type,
                ResponseExpires: new Date(Date.now() + 8.64e7), // expires one day from now
              }),
            );
            message.data = getSignedUrl;
          }
        }
        socket.emit('chat-messages', { withUser, data: data.data });
      } catch (e) {
        console.log('🚀  -> file: chats.ts  -> line 119  -> e', e);
        console.log(e.response.data.error);
      }
    });

    socket.on('put-file-signed-url', async ({ fromUser, toUser, file }: PutFileSignedUrlEventType) => {
      const commandOptions: PutObjectCommandInput | GetObjectCommandInput = {
        Bucket: S3_CHATS_BUCKET_NAME,
        Key: `${computeChatId(fromUser.id, toUser.id)}/${uuid.v4()}.${mime.extension(file.type)}`,
        ACL: 'bucket-owner-full-control',
        ContentType: file.type,
        ResponseExpires: new Date(Date.now() + 8.64e7), // expires one day from now
      };

      const putObjectCommand = new PutObjectCommand(commandOptions);
      const putSignedUrl = await s3GetSignedUrl(s3, putObjectCommand);

      const getObjectCommand = new GetObjectCommand(commandOptions);
      const getSignedUrl = await s3GetSignedUrl(s3, getObjectCommand);

      socket.emit('put-file-signed-url', { putSignedUrl, getSignedUrl });
    });

    socket.on('disconnect', () => {
      io.of('/chats').except(socket.id).emit('user-state-change', { userId: socket.attender.id, state: false });
      userIdToSocketIdMap.delete(socket.attender.id);
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
    io.of('/chats').except(socket.id).emit('user-state-change', { userId: socket.attender.id, state: true });
  });
};

export default registerListeners;
