import { DynamoDB } from 'aws-sdk';
import { makeResponse, loadEnvironmentVariables, validateNotification } from '../shared';
import nanoid from 'nanoid';

loadEnvironmentVariables();
const dynamoDB = new DynamoDB.DocumentClient();

const postNotifications = async (event: any) => {
  console.log(event);

  if (!event.pathParameters.userId)
    return makeResponse(400, false, { error: 'No user ID found as path parameter.' });

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (e) {
    return makeResponse(400, false, { error: e });
  }

  let validatedNotification;
  try {
    validatedNotification = await validateNotification(requestBody);
  } catch (e) {
    return makeResponse(400, false, { error: e.errors[0] });
  }

  const PK = `user_${event.pathParameters.userId}`;
  const SK = `notification_${nanoid()}`;

  const item = { PK, SK, ...validatedNotification };

  const params: DynamoDB.PutItemInput = {
    TableName: process.env.DYNAMODB_TABLE_NAME as string,
    Item: item as DynamoDB.PutItemInputAttributeMap,
  };

  try {
    await dynamoDB.put(params).promise();
  } catch (e) {
    return makeResponse(400, false, {
      error: e,
    });
  }

  return makeResponse(201, true, { data: item });
};

export { postNotifications };
