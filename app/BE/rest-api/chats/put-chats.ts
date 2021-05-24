import { DynamoDB } from 'aws-sdk';
import { makeResponse, validateMessage, loadEnvironmentVariables } from '../shared';

loadEnvironmentVariables();
const dynamoDB = new DynamoDB.DocumentClient();

const putChats = async (event: any) => {
  console.log(event);

  if (!event.pathParameters.chatId)
    return makeResponse(400, false, { error: 'No chat ID found as path parameter.' });
  if (!event.pathParameters.messageId)
    return makeResponse(400, false, { error: 'No message ID found as path parameter.' });

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (e) {
    return makeResponse(400, false, { error: e.message });
  }

  let validatedMessage;
  try {
    validatedMessage = await validateMessage(requestBody);
  } catch (e) {
    return makeResponse(400, false, { error: e.errors[0] });
  }

  const PK = `chat_${event.pathParameters.chatId}`;
  const SK = `message_${event.pathParameters.messageId}`;

  const item = { PK, SK, ...validatedMessage };

  const params: DynamoDB.PutItemInput = {
    TableName: process.env.DYNAMODB_TABLE_NAME as string,
    Item: item as DynamoDB.PutItemInputAttributeMap,
  };

  try {
    await dynamoDB.put(params).promise();
  } catch (e) {
    console.log(e);
    return makeResponse(400, false, { error: e });
  }

  return makeResponse(200, true, { data: item });
};

export { putChats };
