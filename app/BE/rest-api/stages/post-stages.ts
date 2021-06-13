import { DynamoDB } from 'aws-sdk';
import slugify from 'slugify';
import { makeResponse, validateStage, loadEnvironmentVariables, validateAdminGroup } from '../shared';

loadEnvironmentVariables();
const dynamoDB = new DynamoDB.DocumentClient();

const postStages = async (event: any) => {
  console.log(event);

  if (!validateAdminGroup(event.headers.Authorization.split(' ')[1]))
    return makeResponse(401, false, { error: 'User is not an admin.' });

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (e) {
    return makeResponse(400, false, { error: e });
  }

  let validatedStage;
  try {
    validatedStage = await validateStage(requestBody);
  } catch (e) {
    return makeResponse(400, false, { error: e.errors[0] });
  }
  console.log('🚀  -> file: post-stages.ts  -> line 57  -> validatedStage', validatedStage);

  const PK = 'stages';
  const SK = slugify(validatedStage.title, { lower: true });

  const item = { PK, SK, ...validatedStage };

  const params: DynamoDB.PutItemInput = {
    TableName: process.env.DYNAMODB_TABLE_NAME as string,
    Item: item as DynamoDB.PutItemInputAttributeMap,
    ConditionExpression: 'attribute_not_exists(#PK)',
    ExpressionAttributeNames: {
      '#PK': 'PK',
    },
  };

  try {
    await dynamoDB.put(params).promise();
  } catch (e) {
    if (e.code === 'ConditionalCheckFailedException')
      return makeResponse(409, false, {
        error: 'Stage identified by title already exists.',
      });

    return makeResponse(400, false, {
      error: e,
    });
  }

  return makeResponse(201, true, { data: item });
};

export { postStages };
