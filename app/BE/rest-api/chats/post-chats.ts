import { DynamoDB } from 'aws-sdk';
import { makeResponse, validateMessage, loadEnvironmentVariables } from '../shared';
import nanoid from 'nanoid';

loadEnvironmentVariables();
const dynamoDB = new DynamoDB.DocumentClient();

const postChats = async (event: any) => {
  console.log(event);

  if (!event.pathParameters.chatId)
    return makeResponse(400, false, { error: 'No chat ID found as path parameter.' });

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (e) {
    return makeResponse(400, false, { error: e });
  }

  let validatedMessage;
  try {
    validatedMessage = await validateMessage(requestBody);
  } catch (e) {
    return makeResponse(400, false, { error: e.errors[0] });
  }

  const PK = `chat_${event.pathParameters.chatId}`;
  const SK = `message_${validatedMessage.time}_${nanoid()}`;
  
  const item = { PK, SK, ...validatedMessage };
  
  // TODO: handle case when resource already exists
  const params: DynamoDB.PutItemInput = {
    TableName: process.env.DYNAMODB_TABLE_NAME as string,
    Item: item as DynamoDB.PutItemInputAttributeMap,
    ConditionExpression: `attribute_not_exists(#PK) AND (NOT begins_with(#SK, :message_timestamp))`,
    ExpressionAttributeNames: {
      '#PK': 'PK',
      '#SK': 'SK',
    } as DynamoDB.ExpressionAttributeNameMap,
    ExpressionAttributeValues: {
      ':message_timestamp': `message_${validatedMessage.time}`,
    } as DynamoDB.ExpressionAttributeValueMap,
  };
  
  console.log('🚀  -> file: post-chats.ts  -> line 29  -> PK', PK);
  console.log(
    '🚀  -> file: post-chats.ts  -> line 44  -> `message_${validatedMessage.time}`',
    `message_${validatedMessage.time}`
  );
  
  try {
    await dynamoDB.put(params).promise();
  } catch (e) {
    if (e.code === 'ConditionalCheckFailedException')
      return makeResponse(409, false, {
        error: 'Chat message identified by chatroom ID, timestamp and user ID already exists.',
      });

    // TODO: return a string for "error" instead of an object
    return makeResponse(400, false, {
      error: e,
    });
  }

  return makeResponse(201, true, { data: item });
};

export { postChats };
