import { DynamoDB } from 'aws-sdk';
import { getLastEvaluatedKey, makeResponse, loadEnvironmentVariables } from '../shared';

loadEnvironmentVariables();
const dynamoDB = new DynamoDB.DocumentClient();

const getStages = async (event: any) => {
  console.log(event);

  let limit = 20;
  if (event.queryStringParameters?.limit) limit = event.queryStringParameters.limit;

  /**
   * LastEvaluatedKey required if pagination is wanted
   */
  let lastEvaluatedPK, lastEvaluatedSK;
  try {
    [lastEvaluatedPK, lastEvaluatedSK] = getLastEvaluatedKey(event);
  } catch (e) {
    return makeResponse(400, false, { error: e.message });
  }

  const PK = 'stages';

  const params: DynamoDB.QueryInput = {
    TableName: process.env.DYNAMODB_TABLE_NAME as string,
    KeyConditionExpression: '#PK = :PK',
    ExpressionAttributeNames: {
      '#PK': 'PK',
    } as DynamoDB.ExpressionAttributeNameMap,
    ExpressionAttributeValues: {
      ':PK': PK,
    } as DynamoDB.ExpressionAttributeValueMap,
    Limit: limit,
    ConsistentRead: true,
  };

  /**
   * Actual pagination done by setting ExclusiveStartKey to LastEvaluatedKey from previous query.
   * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.Pagination.html
   */
  if (lastEvaluatedPK && lastEvaluatedSK) params.ExclusiveStartKey = { PK: lastEvaluatedPK, SK: lastEvaluatedSK };

  try {
    const { $response } = await dynamoDB.query(params).promise();
    console.log('🚀  -> file: get-stages.ts  -> line 49  -> $response', $response);
    console.log('🚀  -> file: get-stages.ts  -> line 49  -> $response', ($response.data as any).Items);
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

export { getStages };
