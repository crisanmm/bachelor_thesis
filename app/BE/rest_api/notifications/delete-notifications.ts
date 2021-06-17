import { DynamoDB } from 'aws-sdk';
import { makeResponse, loadEnvironmentVariables } from '../shared';

loadEnvironmentVariables();
const dynamoDB = new DynamoDB.DocumentClient();

const deleteNotifications = async (event: any) => {
  console.log(event);

  if (!event.pathParameters.userId) return makeResponse(400, false, { error: 'No user ID found as path parameter.' });

  const PK = `user_${event.pathParameters.userId}`;
  const SK_PREFIX = 'notification_';

  const queryParams: DynamoDB.QueryInput = {
    TableName: process.env.DYNAMODB_TABLE_NAME as string,
    KeyConditionExpression: '#PK = :PK and begins_with(#SK, :SK_PREFIX)',
    ExpressionAttributeNames: {
      '#PK': 'PK',
      '#SK': 'SK',
    } as DynamoDB.ExpressionAttributeNameMap,
    ExpressionAttributeValues: {
      ':PK': PK,
      ':SK_PREFIX': SK_PREFIX,
    } as DynamoDB.ExpressionAttributeValueMap,
    Limit: 1000,
    ConsistentRead: true,
    ScanIndexForward: false,
  };

  const deleteParams: DynamoDB.BatchWriteItemInput = {
    RequestItems: { [process.env.DYNAMODB_TABLE_NAME!]: [] },
  };

  try {
    const { $response: queryResponse } = await dynamoDB.query(queryParams).promise();
    for (const notification of (queryResponse.data as any).Items)
      deleteParams.RequestItems[process.env.DYNAMODB_TABLE_NAME!].push({
        DeleteRequest: { Key: { PK: notification.PK, SK: notification.SK } },
      });
    console.log('🚀  -> file: delete-notifications.ts  -> line 37  -> queryResponse', queryResponse);
    console.log(
      '🚀  -> file: delete-notifications.ts  -> line 37  -> queryResponse',
      (queryResponse.data as any).Items,
    );

    const { $response: deleteResponse } = await dynamoDB.batchWrite(deleteParams).promise();
    console.log('🚀  -> file: delete-chats-id.ts  -> line 28  -> response', deleteResponse);
    return makeResponse(204, true, {});
  } catch (e) {
    return makeResponse(400, false, { error: e });
  }
};

export { deleteNotifications };
