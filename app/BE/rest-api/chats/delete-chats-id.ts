import { DynamoDB } from 'aws-sdk';
import { makeResponse, loadEnvironmentVariables } from '../shared';

loadEnvironmentVariables();
const dynamoDB = new DynamoDB.DocumentClient();

const deleteChatsId = async (event: any) => {
  console.log(event);

  if (!event.pathParameters.chatId)
    return makeResponse(400, false, { error: 'No chat ID found as path parameter.' });
  if (!event.pathParameters.messageId)
    return makeResponse(400, false, { error: 'No message ID found as path parameter.' });

  const PK = `chat_${event.pathParameters.chatId}`;
  const SK = `message_${event.pathParameters.messageId}`;
  console.log('🚀  -> file: delete-chats-id.ts  -> line 16  -> PK', PK);
  console.log('🚀  -> file: delete-chats-id.ts  -> line 18  -> SK', SK);

  const params: DynamoDB.DeleteItemInput = {
    TableName: process.env.DYNAMODB_TABLE_NAME as string,
    Key: { PK: PK, SK: SK } as DynamoDB.Key,
    ReturnValues: 'NONE',
  };

  try {
    const { $response } = await dynamoDB.delete(params).promise();
    console.log('🚀  -> file: delete-chats-id.ts  -> line 28  -> response', $response);
    return makeResponse(204, true, {});
  } catch (e) {
    return makeResponse(400, false, { error: e });
  }
};

export { deleteChatsId };
