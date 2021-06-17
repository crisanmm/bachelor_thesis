import { DynamoDB } from 'aws-sdk';
import { makeResponse, loadEnvironmentVariables, validateAdminGroup } from '../shared';

loadEnvironmentVariables();
const dynamoDB = new DynamoDB.DocumentClient();

const deleteStagesId = async (event: any) => {
  console.log(event);

  if (!validateAdminGroup(event.headers.Authorization.split(' ')[1]))
    return makeResponse(401, false, { error: 'User is not an admin.' });

  if (!event.pathParameters.stageId) return makeResponse(400, false, { error: 'No stage ID found as path parameter.' });

  const PK = 'stages';
  const SK = event.pathParameters.stageId;

  const params: DynamoDB.DeleteItemInput = {
    TableName: process.env.DYNAMODB_TABLE_NAME as string,
    Key: { PK, SK } as DynamoDB.Key,
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
