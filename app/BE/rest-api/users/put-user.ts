import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as JWT from 'jsonwebtoken';
import { makeResponse, loadEnvironmentVariables } from '../shared';

loadEnvironmentVariables();

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

const putUser = async (event: any) => {
  console.log(event);

  // ID token already verified by API Gateway, just decode it
  const { 'cognito:username': userId } = JWT.decode(
    event.headers.Authorization.split(' ')[1]
  ) as any;

  if (userId !== event.pathParameters.userId)
    return makeResponse(401, false, { error: "You can only change your account's attributes." });

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (e) {
    return makeResponse(400, false, { error: e.message });
  }

  const userAttributes = [];
  for (const [attributeName, attributeValue] of Object.entries(requestBody)) {
    if (!attributeName.startsWith('custom'))
      return makeResponse(403, false, { error: 'Only custom attributes are changeable.' });
    userAttributes.push({ Name: attributeName, Value: attributeValue });
  }

  try {
    const { $response } = await cognitoIdentityServiceProvider
      .adminUpdateUserAttributes({
        UserPoolId: process.env.USER_POOL_ID as string,
        Username: userId,
        UserAttributes: userAttributes as CognitoIdentityServiceProvider.AttributeListType,
      })
      .promise();
    console.log($response);
    return makeResponse(200, true, {});
  } catch (e) {
    return makeResponse(400, false, { error: e });
  }
};

export { putUser };
