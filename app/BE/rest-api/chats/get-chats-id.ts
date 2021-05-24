import { DynamoDB } from 'aws-sdk';
import { makeResponse, loadEnvironmentVariables } from '../shared';

loadEnvironmentVariables();
const dynamoDB = new DynamoDB.DocumentClient();

const getChatsId = async (event: any) => {
  console.log(event);

  if (!event.pathParameters.chatId)
    return makeResponse(400, false, { error: 'No chat ID found as path parameter.' });
  if (!event.pathParameters.messageId)
    return makeResponse(400, false, { error: 'No message ID found as path parameter.' });

  const PK = `chat_${event.pathParameters.chatId}`;
  const SK = `message_${event.pathParameters.messageId}`;

  const params: DynamoDB.QueryInput = {
    TableName: process.env.DYNAMODB_TABLE_NAME as string,
    KeyConditionExpression: '#PK = :PK AND #SK = :SK',
    ExpressionAttributeNames: {
      '#PK': 'PK',
      '#SK': 'SK',
    } as DynamoDB.ExpressionAttributeNameMap,
    ExpressionAttributeValues: {
      ':PK': PK,
      ':SK': SK,
    } as DynamoDB.ExpressionAttributeValueMap,
    Limit: 20,
    ConsistentRead: true,
    ScanIndexForward: false,
  };

  try {
    const { $response } = await dynamoDB.query(params).promise();
    console.log('🚀  -> file: get-chat.ts  -> line 31  -> response', $response);
    console.log('🚀  -> file: get-chat.ts  -> line 31  -> response', ($response.data as any).Items);
    return makeResponse(200, true, {
      data: {
        item: ($response.data as any).Items[0],
      },
    });
  } catch (e) {
    return makeResponse(400, false, { error: e });
  }
};

export { getChatsId };
