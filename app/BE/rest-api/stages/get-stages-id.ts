import { DynamoDB } from 'aws-sdk';
import { makeResponse, loadEnvironmentVariables } from '../shared';

loadEnvironmentVariables();
const dynamoDB = new DynamoDB.DocumentClient();

const getStagesId = async (event: any) => {
  console.log(event);

  if (!event.pathParameters.stageId)
    return makeResponse(400, false, { error: 'No stage ID found as path parameter.' });

  const PK = 'stages';
  const SK = event.pathParameters.stageId;

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
    ConsistentRead: true,
    ScanIndexForward: false,
  };

  try {
    const { $response } = await dynamoDB.query(params).promise();
    console.log('🚀  -> file: get-stages-id.ts  -> line 31  -> response', $response);
    console.log('🚀  -> file: get-stages-id.ts  -> line 31  -> response', ($response.data as any).Items);
    return makeResponse(200, true, {
      data: {
        item: ($response.data as any).Items[0],
      },
    });
  } catch (e) {
    return makeResponse(400, false, { error: e });
  }
};

export { getStagesId };
