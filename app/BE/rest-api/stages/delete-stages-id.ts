import { DynamoDB } from 'aws-sdk';
import { makeResponse, loadEnvironmentVariables } from '../shared';

loadEnvironmentVariables();
const dynamoDB = new DynamoDB.DocumentClient();

const deleteStagesId = async (event: any) => {
  console.log(event);

  if (!event.pathParameters.stageId) return makeResponse(400, false, { error: 'No stage ID found as path parameter.' });

  const PK = `stages`;
  const SK = event.pathParameters.stageId;

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

export { deleteStagesId };
