import { DynamoDB } from 'aws-sdk';
import slugify from 'slugify';
import { makeResponse, validateStage, loadEnvironmentVariables, validateAdminGroup } from '../shared';

loadEnvironmentVariables();
const dynamoDB = new DynamoDB.DocumentClient();

const putStages = async (event: any) => {
  console.log(event);

  if (!validateAdminGroup(event.headers.Authorization.split(' ')[1]))
    return makeResponse(401, false, { error: 'User is not an admin.' });

  if (!event.pathParameters.stageId) return makeResponse(400, false, { error: 'No stage ID found as path parameter.' });

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (e) {
    return makeResponse(400, false, { error: e.message });
  }

  let validatedStage;
  try {
    validatedStage = await validateStage(requestBody);
  } catch (e) {
    return makeResponse(400, false, { error: e.errors[0] });
  }

  const PK = `stages`;
  const SK = event.pathParameters.stageId;

  const item = { PK, SK, ...validatedStage };

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

export { putStages };
