import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { AdminGetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { makeResponse, loadEnvironmentVariables } from '../shared';

loadEnvironmentVariables();

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

const getUser = async (event: any) => {
  console.log(event);

  const { userId } = event.pathParameters;

  try {
    const { $response } = await cognitoIdentityServiceProvider
      .adminGetUser({
        UserPoolId: process.env.USER_POOL_ID as string,
        Username: userId,
      })
      .promise();
    console.log($response);

    const userAttributes: { [key: string]: string } = {};
    for (const { Name, Value } of ($response.data as AdminGetUserResponse).UserAttributes!)
      userAttributes[Name] = Value!;
    return makeResponse(200, true, {
      data: userAttributes,
    });
  } catch (e) {
    return makeResponse(400, false, { error: e });
  }
};

export { getUser };
