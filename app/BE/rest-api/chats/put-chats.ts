import { DynamoDB } from 'aws-sdk';
import { makeResponse, validateMessage, loadEnvironmentVariables } from '../shared';
import type { TextMessageType, MediaMessageType } from '../shared';

loadEnvironmentVariables();
const dynamoDB = new DynamoDB.DocumentClient();

// /**
//  * Validate the request body against the path parameter ID .
//  *
//  * @param requestBody Parsed request body.
//  * @param pathParameter The path parameter as passed in the URL.
//  * @returns Path chatroom ID and path SK.
//  */
// const validatePathParameter = (requestBody: any, pathParameter: string) => {
//   let [pathChatroomId, pathTimestamp, pathUserId] = pathParameter.split('@');

//   if (pathChatroomId !== requestBody.chatroomId)
//     throw new Error('Chatroom ID in path inconsistent with chatroom ID in request body.');

//   if (parseInt(pathTimestamp) !== requestBody.time)
//     throw new Error('Timestamp in path inconsistent with timestamp from request body.');

//   if (pathUserId !== requestBody.message.userInformation.id)
//     throw new Error('User ID in path inconsistent with user ID from request body');
// };

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
    return makeResponse(400, false, { error: e });
  }

  let validatedMessage;
  try {
    validatedMessage = await validateMessage(requestBody);
  } catch (e) {
    return makeResponse(400, false, { error: e.message });
  }

  const PK = `chat_${event.pathParameters.chatId}`;
  const SK = `message_${event.pathParameters.messageId}`;

  let updateExpression = 'SET #userInformation = :userInformation, #data = :data, #type = :type, #time = :time';
  let expressionAttributeNames: any = {
    '#userInformation': 'userInformation',
    '#data': 'data',
    '#type': 'type',
    '#time': 'time',
  };
  let expressionAttributeValues: any = {
    ':userInformation': validatedMessage.userInformation,
    ':data': validatedMessage.data,
    ':type': validatedMessage.type,
    ':time': validatedMessage.time,
  };

  if ((validatedMessage as TextMessageType).language) {
    // message is a normal text message
    updateExpression += ', #language = :language';
    expressionAttributeNames['#language'] = 'language';
    expressionAttributeValues[':language'] = (validatedMessage as TextMessageType).language;
  } else {
    // message is a media message
    updateExpression += ', #alt = :alt';
    expressionAttributeNames['#alt'] = 'alt';
    expressionAttributeValues[':alt'] = (validatedMessage as MediaMessageType).alt;
  }

  const params: DynamoDB.UpdateItemInput = {
    TableName: process.env.DYNAMODB_TABLE_NAME as string,
    Key: { PK, SK } as DynamoDB.Key,
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames as DynamoDB.ExpressionAttributeNameMap,
    ExpressionAttributeValues: expressionAttributeValues as DynamoDB.ExpressionAttributeValueMap,
    ReturnValues: 'ALL_NEW',
  };

  try {
    await dynamoDB.update(params).promise();
  } catch (e) {
    console.log(e);
    return makeResponse(400, false, { error: e });
  }

  return makeResponse(200, true, { data: { PK, SK, message: validatedMessage } });
};

export { putChats };
