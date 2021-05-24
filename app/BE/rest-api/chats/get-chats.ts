import { DynamoDB } from 'aws-sdk';
import { makeResponse, loadEnvironmentVariables } from '../shared';

loadEnvironmentVariables();
const dynamoDB = new DynamoDB.DocumentClient();

const getLastEvaluatedKey = (event: any) => {
  let lastEvaluatedPK, lastEvaluatedSK;
  if (
    event.queryStringParameters?.lastEvaluatedPK ||
    event.queryStringParameters?.lastEvaluatedSK
  ) {
    if (!event.queryStringParameters?.lastEvaluatedPK)
      throw new Error(
        'No lastEvalutedPK found as query parameter despite finding lastEvaluatedSK.'
      );
    lastEvaluatedPK = event.queryStringParameters.lastEvaluatedPK;

    if (!event.queryStringParameters?.lastEvaluatedSK)
      throw new Error(
        'No lastEvalutedSK found as query parameter despite finding lastEvaluatedPK.'
      );
    lastEvaluatedSK = event.queryStringParameters.lastEvaluatedSK;
  }

  return [lastEvaluatedPK, lastEvaluatedSK];
};

const getChats = async (event: any) => {
  console.log(event);

  if (!event.pathParameters.chatId)
    return makeResponse(400, false, { error: 'No chat ID found as path parameter.' });

  /**
   * LastEvaluatedKey required if pagination is wanted
   */
  let lastEvaluatedPK, lastEvaluatedSK;
  try {
    [lastEvaluatedPK, lastEvaluatedSK] = getLastEvaluatedKey(event);
  } catch (e) {
    return makeResponse(400, false, { error: e.message });
  }

  const PK = `chat_${event.pathParameters.chatId}`;

  const params: DynamoDB.QueryInput = {
    TableName: process.env.DYNAMODB_TABLE_NAME as string,
    KeyConditionExpression: '#PK = :PK',
    ExpressionAttributeNames: {
      '#PK': 'PK',
    } as DynamoDB.ExpressionAttributeNameMap,
    ExpressionAttributeValues: {
      ':PK': PK,
    } as DynamoDB.ExpressionAttributeValueMap,
    Limit: 20,
    ConsistentRead: true,
    ScanIndexForward: false,
  };

  /**
   * Actual pagination done by settings ExclusiveStartKey to LastEvaluatedKey from previous query.
   * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.Pagination.html
   */
  if (lastEvaluatedPK && lastEvaluatedSK)
    params.ExclusiveStartKey = { PK: lastEvaluatedPK, SK: lastEvaluatedSK };

  try {
    const { $response } = await dynamoDB.query(params).promise();
    console.log('🚀  -> file: get-chat.ts  -> line 31  -> response', $response);
    console.log('🚀  -> file: get-chat.ts  -> line 31  -> response', ($response.data as any).Items);
    return makeResponse(200, true, {
      data: {
        lastEvaluatedPK: ($response.data as any).LastEvaluatedKey?.PK,
        lastEvaluatedSK: ($response.data as any).LastEvaluatedKey?.SK,
        items: ($response.data as any).Items,
      },
    });
  } catch (e) {
    return makeResponse(400, false, { error: e });
  }
};

export { getChats };
